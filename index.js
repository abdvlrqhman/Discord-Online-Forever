const Eris = require("eris");
const keep_alive = require('./keep_alive.js'); // Assuming this keeps your bot online

// Replace TOKEN with your bot account's token (store securely using environment variables)
require('env').config();

const bot = new Eris(process.env.token);

const channelId = '1220488067203338381'; // Replace with your actual channel ID

async function joinVoiceChannel(channelId) {
  try {
    const guild = bot.guilds.get(channelId.split('-')[0]); // Extract guild ID from channel ID
    if (!guild) {
      console.error('Guild not found for channel ID:', channelId);
      return;
    }

    const voiceChannel = await guild.channels.get(channelId);
    if (!voiceChannel) {
      console.error('Voice channel not found:', channelId);
      return;
    }

    if (!voiceChannel.permissionsFor(bot.user).has('VIEW_CHANNEL') ||
        !voiceChannel.permissionsFor(bot.user).has('CONNECT')) {
      console.error('Bot does not have permission to join the voice channel:', channelId);
      return;
    }

    const connection = await voiceChannel.join();

    // Optional: Handle voice connection events (ready, speaking, disconnected, etc.)
    connection.on('ready', () => {
      console.log('Bot joined voice channel:', channelId);
    });

    connection.on('disconnected', (error) => {
      if (error) {
        console.error('Voice connection error:', error);
        // Attempt to reconnect automatically (optional)
      } else {
        console.log('Voice connection disconnected:', channelId);
        // Reconnect logic (optional)
      }
    });

  } catch (error) {
    console.error('Error joining voice channel:', error);
  }
}

bot.on('messageCreate', async (msg) => {
  if (msg.content.toLowerCase() === '.joiny') {
    joinVoiceChannel(channelId);
  }
});

bot.on("error", (err) => {
  console.error(err);
});

bot.connect();

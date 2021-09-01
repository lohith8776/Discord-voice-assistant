const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const googleTTS = require('google-tts-api')
const config = require("./config.json")

client.on('ready', () => {
    console.log('Ready')
})


client.on('message', async (message) => {
        if (message.author.bot || !message.guild) return;
        if(message.channel.id !== config.channel_id ) return;

        if (!message.member.voice.channel)
            return message.reply("🚫|You must be on a voice channel.");

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel))
            return message.reply(`🚫|You must be on this ${message.guild.me.voice.channel} voice channel.`);

        const res = await fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${config.your_bot_name}&ownername=${config.owner_name}&user=${message.author.id}`, {});
		    const response = await res.json();
        message.member.voice.channel.join().then(conn => {
          message.reply(response.message)
          googleTTS( response.message, "en-US", 1)
            .then((url) => {
              conn.play(url)
            })
            .catch((err) => {
              console.error(err.stack);
            });
        })
        })
     
client.login(config.token)

const { player } = require("../include/player");
const { YOUTUBE_API_KEY, PREFIX } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const {
  playDescription,
  noChannel,
  argsError,
  noPerissionsConnect,
  noPermissionsVoice,
} = require("../util/messages.json");

module.exports = {
  name: "play",
  cooldown: 0,
  aliases: ["p"],
  description: playDescription,
  async execute(message, args) {
    const { channel } = message.member.voice;
    if (!channel) return message.reply(noChannel).catch(console.error);

    const Queue = message.client.queue.get(message.guild.id);
    if (Queue && channel !== message.guild.me.voice.channel)
      return message
        .reply(`Você deve estar no mesmo canal que ${message.client.user}`)
        .catch(console.error);

    if (!args.length) return message.reply(argsError).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.reply(noPerissionsConnect);

    if (!permissions.has("SPEAK")) return message.reply(noPermissionsVoice);

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /list=/gi;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);
    //Verifica se é playlist, caso seja retorna a execução dela
    if (playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    let songInfo = null;
    let song = null;
    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
        };
      } catch (error) {
        console.error(error);
        return message
          .reply("Não achei nenhum video com esse titulo")
          .catch(console.error);
      }
    }
    if (Queue) {
      Queue.songs.push(song);
      return message.channel
        .send(
          `✅ **${song.title}** Foi adicionado a playlist pelo ${message.author}`
        )
        .catch(console.error);
    }
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true,
    };
    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      player(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel
        .send(`Não consegui conectar ao canal: ${error}`)
        .catch(console.error);
    }
  },
};

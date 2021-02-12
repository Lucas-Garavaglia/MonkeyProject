const { MessageEmbed } = require("discord.js");
const { player } = require("../include/player");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const {
  playlistDescription,
  noPermissionsVoice,
  noPermissionsConnect,
  argsError,
  noChannel,
} = require("../util/messages.json");
module.exports = {
  name: "playlist",
  cooldown: 1,
  aliases: ["pl"],
  description: playlistDescription,
  async execute(message, args) {
    const { channel } = message.member.voice;
    if (!channel) return message.reply(noChannel).catch(console.error);

    const Queue = message.client.queue.get(message.guild.id);
    if (Queue && channel !== message.guild.me.voice.channel)
      return message
        .reply(`Você precisa estar no mesmo canal que ${message.client.user}`)
        .catch(console.error);

    if (!args.length) return message.reply(argsError).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.reply(noPermissionsConnect);
    if (!permissions.has("SPEAK")) return message.reply(noPermissionsVoice);

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
          part: "snippet",
        });
      } catch (error) {
        console.error(error);
        return message.reply("Playlist não encontrada :(").catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, {
          part: "snippet",
        });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
          part: "snippet",
        });
      } catch (error) {
        console.error(error);
        return message.reply("Playlist not found :(").catch(console.error);
      }
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
    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds,
      };

      if (Queue) Queue.songs.push(song);
      queueConstruct.songs.push(song);
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    playlistEmbed.setDescription(
      queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`)
    );
    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + "\n...";
    if (!Queue)
      message.channel.send(
        `${message.author} Iniciou a playlist`,
        playlistEmbed
      );
    else
      message.channel.send(
        `${message.author} Adicionou a playlist`,
        playlistEmbed
      );
    if (!Queue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!Queue) {
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        player(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel
          .send(`Não conseguir conectar ao canal: ${error}`)
          .catch(console.error);
      }
    }
  },
};

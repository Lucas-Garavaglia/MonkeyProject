const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const { nowPlaying, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "np",
  aliases: ["nowPlaying", "ra", "Reproduzindo"],
  description: nowPlaying,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    const song = queue.songs[0];
    const seek =
      (queue.connection.dispatcher.streamTime -
        queue.connection.dispatcher.pausedTime) /
      1000;
    const left = song.duration - seek;

    let nowPlaying = new MessageEmbed()
      .setTitle("Reproduzindo")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor("Andria")
      .addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0
            ? " ◉ LIVE"
            : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );

    if (song.duration > 0)
      nowPlaying.setFooter(
        "Tempo Restante: " + new Date(left * 1000).toISOString().substr(11, 8)
      );

    return message.channel.send(nowPlaying);
  },
};

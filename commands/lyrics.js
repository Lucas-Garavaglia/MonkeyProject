const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { lyricsDescription, noPlayListFound } = require("../util/messages.json");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: lyricsDescription,
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(noPlayListFound).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics)
        lyrics = `Não encontrei a letra para o video ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `Ouve um erro ao buscar a letra para o video ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Letra")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp()
      .setFooter(
        `Requerido por ${message.author.tag}.`,
        message.author.displayAvatarURL
      );
    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    message.channel.send(lyricsEmbed).catch(console.error);
  },
};

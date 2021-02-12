const { canModifyQueue } = require("../util/Util");
const { volumeDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "volume",
  aliases: ["v"],
  description: volumeDescription,
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!args[0])
      return message
        .reply(`🔊 O volume atual é: **${queue.volume}%**`)
        .catch(console.error);
    if (isNaN(args[0]))
      return message
        .reply("Use um número para modificar o volume.")
        .catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message
        .reply("Insira um número entre 0 - 100.")
        .catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel
      .send(`Volume modificado para: **${args[0]}%**`)
      .catch(console.error);
  },
};

const { canModifyQueue } = require("../util/Util");
const {
  skipToDescription,
  noPlayListFound,
  argsError,
} = require("../util/messages.json");
module.exports = {
  name: "skipto",
  aliases: ["st", "goto"],
  description: skipToDescription,
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(noPlayListFound).catch(console.error);
    if (!args.length) return message.reply(argsError).catch(console.error);

    if (isNaN(args[0])) return message.reply(argsError).catch(console.error);

    if (!canModifyQueue(message.member)) return;

    if (args[0] > queue.songs.length)
      return message
        .reply(`A fila só tem  ${queue.songs.length} músicas`)
        .catch(console.error);

    queue.playing = true;
    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    queue.connection.dispatcher.end();
    queue.textChannel
      .send(`${message.author} ⏭ pulou ${args[0] - 1} músicas`)
      .catch(console.error);
  },
};

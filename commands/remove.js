const { canModifyQueue } = require("../util/Util");
const {
  removeDescription,
  noPlayListFound,
  argsError,
} = require("../util/messages.json");
module.exports = {
  name: "remove",
  description: removeDescription,
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (!args.length) return message.reply(argsError);
    if (isNaN(args[0])) return message.reply(argsError);
    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(
      `${message.author} ❌ removeu **${song[0].title}** da lista de reprodução.`
    );
  },
};

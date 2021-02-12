const { canModifyQueue } = require("../util/Util");
const { stopDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "stop",
  aliases: ["exit", "leave"],
  description: stopDescription,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel
      .send(`${message.author} ⏹ parou a música!`)
      .catch(console.error);
  },
};

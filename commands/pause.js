const { canModifyQueue } = require("../util/Util");
const { pauseDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "pause",
  description: pauseDescription,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸`).catch(console.error);
    }
  },
};

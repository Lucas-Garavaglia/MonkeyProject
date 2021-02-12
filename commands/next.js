const { canModifyQueue } = require("../util/Util");
const { nextDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "next",
  aliases: ["s", "skip", "n"],
  description: nextDescription,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel
      .send(`${message.author} ⏭ pulou a musica`)
      .catch(console.error);
  },
};

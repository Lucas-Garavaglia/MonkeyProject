const { canModifyQueue } = require("../util/Util");
const { resumeDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "resume",
  aliases: ["r"],
  description: resumeDescription,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶`).catch(console.error);
    }

    return message
      .reply("A música não está em estado de espera")
      .catch(console.error);
  },
};

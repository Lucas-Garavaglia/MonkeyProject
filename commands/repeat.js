const { canModifyQueue } = require("../util/Util");
const { repeatDescription, noPlayListFound } = require("../util/messages.json");
module.exports = {
  name: "loop",
  aliases: ["l", "lp", "lq", "repeat"],
  description: repeatDescription,
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(noPlayListFound).catch(console.error);

    if (!canModifyQueue(message.member)) return;
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(
        `Repetição agora está ${queue.loop ? "**Ligada**" : "**Desligada**"}`
      )
      .catch(console.error);
  },
};

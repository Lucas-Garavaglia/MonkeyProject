const { MessageEmbed } = require("discord.js");
const { helpDescription } = require("../util/messages.json");
module.exports = {
  name: "help",
  aliases: ["h", "ajuda"],
  description: helpDescription,
  execute(message) {
    let commands = message.client.commands.array();
    let helpEmbed = new MessageEmbed()
      .setTitle(`AJUDA`)
      .setDescription("Lista de todos os comandos")
      .setColor("#F8AA2A")
      .setFooter(
        `Requerido por ${message.author.tag}.`,
        message.author.displayAvatarURL
      );

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**!${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });
    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  },
};

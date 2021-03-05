const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rank",
	description: "Mostra o rank geral.[EM MANUTENÇÃO]",
	execute(message, args, db) {
		var Embed = new MessageEmbed();
		Embed.setColor("#0000FF")
			.setTitle(`Ranking`)
			.setDescription("Mostra o raking");
		db.all(`SELECT * FROM Users ORDER BY level DESC`, (err, rows) => {
			for (var i = 0; i < rows.length; i++) {
				Embed.addField(
					`(${i + 1}) `,
					`${rows[i].name} está no level ${rows[i].level}`
				);
			}
			message.channel.send(Embed).catch(console.error);
		});
	},
};


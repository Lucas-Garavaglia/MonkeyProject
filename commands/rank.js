const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rank",
	description: "Mostra o rank geral.",
	execute(message, args, db) {
		var Embed = new MessageEmbed();
		Embed.setColor("#F0F0FF")
			.setTitle(`Ranking`)
			.setDescription("Mostra o raking");
		db.all(`SELECT * FROM Users ORDER BY level DESC,xp DESC;`, (err, rows) => {
			for (var i = 0; i < rows.length; i++) {
				Embed.addField(
					`(${i + 1}) ${rows[i].name}`,
					`Level ${rows[i].level}\nXp ${rows[i].xp}`
				);
			}
			message.channel.send(Embed).catch(console.error);
		});
	},
};

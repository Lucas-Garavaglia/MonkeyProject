const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rank",
	description: "Mostra o rank geral.",
	execute(message, args, db) {
		var Embed = new MessageEmbed();
		var experience = 0;
		Embed.setColor("#F0F0FF")
			.setTitle(`Ranking`)
			.setDescription("Mostra o raking");
		db.all(`SELECT * FROM Users ORDER BY level DESC,xp DESC;`, (err, rows) => {
			for (var i = 0; i < rows.length; i++) {
				for (var j = 0, experience = 0; j < rows[i].level; j++) {
					experience = experience + Math.pow((j + 1) * 4, 2);
				}
				Embed.addField(
					`(${i + 1}) ${rows[i].name}`,
					`Level ${rows[i].level}
					 Xp ${rows[i].xp}
					 Total Xp ${experience}`
				);
			}
			message.channel.send(Embed).catch(console.error);
		});
	},
};

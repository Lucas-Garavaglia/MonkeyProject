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
		db.all(
			`SELECT * FROM Users WHERE idServer=${message.guild.id} ORDER BY level DESC,xp DESC;`,
			(err, rows) => {
				for (var i = 0; i < rows.length; i++) {
					for (var j = 0, experience = 0; j < rows[i].level; j++) {
						experience = experience + Math.pow((j + 1) * 4, 2);
					}
					experience = experience + rows[i].xp;
					Embed.addField(
						`(${i + 1}) ${rows[i].name}`,
						`Level ${rows[i].level}\nXp ${rows[i].xp}\nTotal Xp ${experience}`
					);
				}
				message.channel.send(Embed).catch(console.error);
			}
		);
	},
};

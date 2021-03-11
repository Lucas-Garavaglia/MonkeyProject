const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "status",
	description: "Mostra seus status de xp.",
	execute(message, args, db) {
		let user = message.author.id;
		let experience = 0;
		let nextLevel;
		db.get(
			`SELECT * FROM Users Where idUser=${user} AND idServer=${message.guild.id}`,
			(err, row) => {
				if (err) {
					console.error(err);
				}
				for (var i = 0; i < row.level; i++) {
					experience = experience + Math.pow((i + 1) * 4, 2);
				}
				nextLevel = Math.pow((row.level + 1) * 4, 2) - row.xp;
				experience = experience + row.xp;
				const Embed = new MessageEmbed()
					.setTitle("XP / LEVEL")
					.setDescription(message.author.tag)
					.setThumbnail(
						`${message.author.avatarURL({
							dynamic: true,
							format: "png",
							size: 1024,
						})}`
					)
					.setColor("#00F111")
					.addField("**" + "Level" + "**", row.level, true)
					.addField("**" + "XP" + "**", row.xp, true)
					.addField("**" + "Total XP" + "**", experience, true)
					.setFooter(`${nextLevel} XP para o proximo level`);
				message.channel.send(Embed).catch(console.error);
			}
		);
	},
};

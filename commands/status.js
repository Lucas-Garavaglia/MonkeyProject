const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "status",
	description: "Mostra seus status de xp.",
	execute(message, args, db) {
		let user = message.author.id;
		let experience = 0;
		db.get(`SELECT * FROM Users Where id=${user}`, (err, row) => {
			if (err) {
				console.error(err);
			}
			experience = Math.pow(row.level * 4, 2) + row.xp;
			let Embed = new MessageEmbed()
				.setColor("#00F111")
				.setTitle(`Status do ${message.author.tag}.`)
				.addField("Level: ", row.level)
				.addField("Xp acumulada: ", experience)
				.setThumbnail(
					`${message.author.avatarURL({
						dynamic: true,
						format: "png",
						size: 1024,
					})}`
				);
			message.channel.send(Embed).catch(console.error);
		});
	},
};
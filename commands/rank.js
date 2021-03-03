const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "rank",
	description: "Mostra o rank geral.[EM MANUTENÇÃO]",
	execute(message, args, db) {
		let Embed = new MessageEmbed().setColor("#0000FF").setTitle(`Ranking`);
		let count = 1;
		db.all(`SELECT * FROM Users ORDER BY level DESC`, (err, rows) => {
			rows.forEach((row) => {
				Embed.addField(`${count}   ${row.name} está no level `, row.level);
				count = count + 1;
			});
		});
		message.channel.send(Embed).catch(console.error);
	},
};

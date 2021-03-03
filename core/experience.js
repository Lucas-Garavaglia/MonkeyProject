module.exports = {
	name: "coreXp",
	Description: "Cuida dos níveis dos usuários do discord.",
	execute(message, db, isCommand) {
		let user = message.author;
		let addXp = 10;
		if (isCommand) {
			addXp = 25;
		}
		db.get(`SELECT * FROM Users Where id=${user.id}`, (err, row) => {
			if (err) {
				console.error(err);
			}
			if (!row) {
				db.run(
					`INSERT INTO Users (id,xp,level,name) VALUES (${user.id},1,1,"${user.tag}")`
				);
			} else {
				let selXP = row.xp;
				let selLevel = row.level;
				let experienceToNextLevel = Math.pow((selLevel + 1) * 4, 2);
				let finalExperience = selXP + addXp;
				if (finalExperience >= experienceToNextLevel) {
					finalExperience = finalExperience - experienceToNextLevel;
					db.run(
						`UPDATE Users 
             SET level=${selLevel + 1},xp=${finalExperience} 
             WHERE id=${user.id}`,
						(err) => {
							if (err) {
								console.error(err);
							}
							message.reply(`Você agora é level **${selLevel + 1}**`);
						}
					);
				} else {
					db.run(`UPDATE Users SET xp=${finalExperience} WHERE id=${user.id}`);
				}
			}
		});
	},
};

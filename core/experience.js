module.exports = {
	name: "coreXp",
	Description: "Cuida dos níveis dos usuários do discord.",
	execute(message, db, isCommand) {
		let user = message.author;
		let addXp;
		var dataAtual = new Date();
		if (isCommand) {
			addXp = Math.floor(Math.random() * (40 - 20)) + 20;
		} else {
			addXp = Math.floor(Math.random() * (15 - 5)) + 5;
		}
		db.get(
			`SELECT * FROM Users Where idUser=${user.id} AND idServer=${message.guild.id}`,
			(err, row) => {
				if (err) {
					console.error(err);
				}
				if (!row) {
					db.run(
						`INSERT INTO Users (idUser,xp,level,name,idServer) VALUES (${user.id},1,1,"${user.tag}",${message.guild.id})`
					);
				} else {
					if (dataAtual.getTime() - row.lastMessage > 15000) {
						let selXP = row.xp;
						let selLevel = row.level;
						let experienceToNextLevel = Math.pow((selLevel + 1) * 4, 2);
						let finalExperience = selXP + addXp;
						if (finalExperience >= experienceToNextLevel) {
							finalExperience = finalExperience - experienceToNextLevel;
							db.run(
								`UPDATE Users 
             SET level=${selLevel + 1},xp=${finalExperience},
							lastMessage=${dataAtual.getTime()} 
							WHERE idUser=${user.id} AND idServer=${message.guild.id}`,
								(err) => {
									if (err) {
										console.error(err);
									}
									message.reply(`Você agora é level **${selLevel + 1}**`);
								}
							);
						} else {
							db.run(
								`UPDATE Users SET xp=${finalExperience},
							lastMessage=${dataAtual.getTime()}  
							WHERE idUser=${user.id} AND idServer=${message.guild.id}`
							);
						}
					} else {
						 db.run(
						 	`UPDATE Users SET	lastMessage=${dataAtual.getTime()}
						 	WHERE idUser=${user.id} AND idServer=${message.guild.id}`
						 );
					}
				}
			}
		);
	},
};

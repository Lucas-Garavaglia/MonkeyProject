const fs = require("fs");
const Discord = require("discord.js");
const Client = require("./client/Client");
const { prefix, token } = require("./config.json");
const { isUndefined } = require("util");
const core = require("./core/experience");

const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./database/migrations/ExperienceDiscord.db");

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once("ready", () => {
	console.log("Ready!");
	client.user.setActivity(`${prefix}help | Monkey Project!`);
});
client.on("message", async (message) => {
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		);
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	if (!command) {
		core.execute(message, db, false);
	} else {
		core.execute(message, db, true);
	}
	if (!message.content.startsWith(prefix)) return;
	command.execute(message, args, db);
});

client.login(token);

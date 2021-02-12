const ytdlDiscord = require("ytdl-core-discord");
const { canModifyQueue } = require("../util/Util");

module.exports = {
  async player(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel
        .send("🚫 Acabou a playlist")
        .catch(console.error);
    }
    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.player(queue.songs[0], message);
      }
      console.error(error);
      return message.channel.send(
        `Erro: ${error.message ? error.message : error}`
      );
    }
    queue.connection.on("disconnect", () =>
      message.client.queue.delete(message.guild.id)
    );
    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.player(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.player(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.player(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      var playingMessage = await queue.textChannel.send(
        `🎶 Reproduzindo: **${song.title}** ${song.url}`
      );
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000,
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);
      switch (reaction.emoji.name) {
        case "⏭":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.playing = true;
          queue.connection.dispatcher.end();
          queue.textChannel
            .send(`${user} ⏩ Pulo a música`)
            .catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(`${user} ⏸`).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`${user} ▶`).catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel
            .send(
              `A repetição agora está ${
                queue.loop ? "**Ligada**" : "**Desligada**"
              }`
            )
            .catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel
            .send(`${user} ⏹ parou a música!`)
            .catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  },
};

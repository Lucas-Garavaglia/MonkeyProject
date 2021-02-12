module.exports = {
  name: "leave",
  description: "Desconecta o bot do canal.",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você tem que estar em um canal de voz para parar a música!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  },
};

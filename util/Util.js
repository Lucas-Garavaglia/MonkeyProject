module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;
    if (channel !== botChannel) {
      member
        .send("Você precisa entrar no mesmo canal que eu primeiro!")
        .catch(console.error);
      return false;
    }
    return true;
  },
};

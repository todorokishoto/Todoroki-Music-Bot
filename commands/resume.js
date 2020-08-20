const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Resume currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    const res = new MessageEmbed()
    .setTitle("🎶 Resume Songs")
    .setDescription(`${message.author} resume the songs !`)
    .setColor(0x2f3136)
    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(res).catch(console.error);
    }

    return message.reply("The queue is not paused.").catch(console.error);
  }
};

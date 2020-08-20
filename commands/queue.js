const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: "Show the music queue and now playing.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    const description = queue.songs.map((song, index) => `[${index + 1}] [${escapeMarkdown(song.title)}](${song.url})`);
    const song = queue.songs[0];
    
    let queueEmbed = new MessageEmbed()
      .setTitle("Todoroki Music Queue")
      .setDescription(`${description}\n\n**Now Playing** :\n[${song.title}](${song.url})`)
      .setColor(0x2f3136);

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};

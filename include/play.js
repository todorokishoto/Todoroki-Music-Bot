const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require('discord.js');
 
module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);
    const endedowo =  new MessageEmbed()
    .setTitle("Ended")
    .setDescription(`Music queue is ended, played by ${message.author}`)
    .setColor(0x2f3136)
 
 if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send(endedowo).catch(console.error);
    }

    let stream = null;

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com") && SOUNDCLOUD_CLIENT_ID) {
        const info = await scdl.getInfo(song.url, SOUNDCLOUD_CLIENT_ID);
        const opus = scdl.filterMedia(info.media.transcodings, { format: scdl.FORMATS.OPUS });
        stream = await scdl.downloadFromURL(opus[0].url, SOUNDCLOUD_CLIENT_ID);
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const type = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
    const dispatcher = queue.connection
      .play(stream, { type: type })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
    const owoh = new MessageEmbed()
    .setTitle("🎶 Started Playing")
    .setDescription(`**${song.title}** by ${message.author}`)
    .setColor(0x2f3136)
   // .setThumbnail(song[0].th
 //.setCor
    
    //.
    
    
    
    
    
    
        //        
//.setColor(0x2f3136)
                    
    try {
      var playingMessage = await queue.textChannel.send(`<a:Cd:712209778478415902> Started Playing : **${song.title}** in **${song.duration} second**`);
      await playingMessage.react("");
			await playingMessage.react("");
      await playingMessage.react("");
      await playingMessage.react("");
      await playingMessage.react("");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${user} ⏩ skipped the song`).catch(console.error);
          collector.stop();
          break;

        case "":
					if (!queue.playing) break;
					queue.playing = false;
					queue.connection.dispatcher.pause();
					let pausedEmbed = new MessageEmbed()
						.setTitle("Paused")
						.setDescription(`The music has been paused by ${user}`)
						.setColor(`#d32f2f`);

					queue.textChannel
						.send(pausedEmbed)
						.then((msg) => {
							setTimeout(() => {
								if (msg.deletable) {
									msg.delete();
								}
							}, 10000);
						})
						.catch(console.error);
					reaction.users.remove(user);
					break;

				case "":
					if (queue.playing) break;
					queue.playing = true;
					queue.connection.dispatcher.resume();
					let resumeEmbed = new MessageEmbed()
						.setTitle("Resume")
						.setDescription(`The music has been resumed by ${user}`)
						.setColor(`#388e3c`);

					queue.textChannel
						.send(resumeEmbed)
						.then((msg) => {
							setTimeout(() => {
								if (msg.deletable) {
									msg.delete();
								}
							}, 10000);
						})
						.catch(console.error);

					reaction.users.remove(user);
					break;

        case "":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`).catch(console.error);
          break;

        case "":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(`${user} ⏹ stopped the music!`).catch(console.error);
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
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};

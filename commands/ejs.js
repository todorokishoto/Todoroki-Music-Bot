const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "ejs",
  alises: ["ej"],
  description: "Eval code in js",
  execute(message, args) {
        function clean(text) {

            if (typeof text === "string")

                return text

                    .replace(/`/g, "`" + String.fromCharCode(8203))

                    .replace(/@/g, "@" + String.fromCharCode(8203));

            else return text;

        }

        let owner = process.env.OWN

        if (!owner.includes(message.author.id)) return;

        try {

            const code = args.join(" ");

            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            message.react("🔊");

            var emb = new MessageEmbed()

                .setTitle('OuTpUt CoDe')

                .setDescription(`\`\`\`js` + '\n' + clean(evaled) + `\n` + `\`\`\``)

           //     .setFooter(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))

                .setColor(0x2f3136)

            message.channel.send(emb);

        } catch (err) {

            message.react("🔇");

            var emb = new MessageEmbed()

                .setTitle('OuTpUt CoDe')

                .setDescription(`\`\`\`js` + '\n' + clean(err) + `\n` + `\`\`\``)

         //       .setFooter(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))

                .setColor(0x2f3135)

            message.channel.send(emb);

        }

    }

}
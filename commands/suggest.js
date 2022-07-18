const { MessageEmbed } = require("discord.js")

module.exports = {
    category: 'Suggestions',
    description: 'Crée une suggestion.',

    slash: 'both',

    callback: async ({ client, message, args }) => {
        const suggestionchannel = "980021197871910917"
        const suggestionQuery = args.join(" ")
        if(!suggestionQuery) return 'Veuillez indiquer une suggestion !'

        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Suggestion**: ${suggestionQuery}`)
            .setColor('ORANGE')
            .setTimestamp()
            .addField("Status", 'EN ATTENTE')

        message.reply("Suggestion envoyé !")
        message.guild.channels.cache.get(suggestionchannel).send({ embeds: [ embed ]})
    }
}
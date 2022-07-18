const { MessageEmbed } = require("discord.js")

module.exports = {
    category: 'Suggestions',
    description: 'Crée une suggestion.',

    slash: 'both',

    callback: async ({ client, message, args }) => {
        const suggestionchannel = "992869986227994704"
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
        .then(function (message){
            message.react("<:yes:995341291665752194>")
            message.react("<:default:997811499269632040>")
            message.react("<:no:995341332140793917>")
        }).catch(function(){
            console.log(err)
        })
    }
}

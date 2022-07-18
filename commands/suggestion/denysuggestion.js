const { MessageEmbed } = require("discord.js")

module.exports = {
    category: 'Suggestions',
    description: 'Décline une suggestion',

    permissions: ['ADMINISTRATOR'],

    slash: 'both',

    callback: async ({ client, message, args }) => {
        const messageID = args[0]
        const denyQuery = args.slice(1).join(" ")

        if(!messageID) return 'Spécifiez un identifiant de message !'
        if(!denyQuery) return 'Spécifiez une raison !'
        try{
            const suggestionChannel = message.guild.channels.cache.get("")
            const suggestedEmbed = await suggestionChannel.messages.fetch(messageID)
            const data = suggestedEmbed.embeds[0]
            const acceptEmbed = new MessageEmbed()
            .setAuthor(data.author.name, data.author.iconURL)
            .setDescription(data.description)
            .setColor('RED')
            .addField("Status ( DÉCLINÉ )", denyQuery)

            suggestedEmbed.edit(acceptEmbed)

            message.reply("La suggestion a bien été déclinée !")

            const user = client.users.cache.find((u) => u.tag === data.author.name)
            user.send("Ta suggestion a bien été décliné par un modérateur !")
        }catch(err){
            console.log(err)
            return 'Cette suggestion n\'existe pas !'
        }
    }
}
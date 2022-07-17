const { Client, GuildMember, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Role, TextChannel } = require("discord.js");

module.exports = {
    category: 'Configuration',
    description: 'Ajoute un auto role a un message auto role.',

    permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    maxArgs: 2,
    expectedArgs: '<channel> <message>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    
    guildOnly: true,

    callback: async ({ message, interaction, args, client }) => {

    const channel = (
        message 
            ? message.mentions.channels.first() 
            : interaction.options.getChannel('channel')
        )

    const message2 = (
        message
            ? args[1]
            : interaction.options.getString('message')
        )

        channel.send({ content: message2 })

        return 'Message envoyé !'
    }
}
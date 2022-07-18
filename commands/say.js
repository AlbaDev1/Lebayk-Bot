module.exports = {
    category: 'Configuration',
    description: 'Ajoute un auto role a un message auto role.',

    permissions: ['ADMINISTRATOR'],

    minArgs: 2,
    expectedArgs: '<channel> <text>',
    expectedArgsTypes: ['CHANNEL', 'STRING'],

    slash: 'both',
    
    guildOnly: true,

    callback: async ({ message, interaction, args }) => {

    const channel = (
        message 
            ? message.mentions.channels.first() 
            : interaction.options.getChannel('channel')
        )
    if(!channel | channel.type !== 'GUILD_TEXT'){
        return 'Please tag a text channel.'
    }

    args.shift()
    const text = args.join(' ')

    channel.send(text)

    if(interaction){
        interaction.reply({
            content: 'Message envoyé !',
            ephemeral: true
        })
    }
    }
}

const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton , WebhookClient } = require('discord.js')

module.exports = {
    category: 'Configuration',
    description: 'Crée une embed de ticket.',

    permissions: ['ADMINISTRATOR'],

    slash: 'both',
    
    guildOnly: true,

    init: ( client ) => {
      client.on('interactionCreate', interaction => {
        if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
    if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
    return interaction.reply({
      content: 'Tu as déjà ouvert un ticket !',
      ephemeral: true
    });
    };
    
    interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
    parent: '994272579823075479',
    topic: interaction.user.id,
    permissionOverwrites: [{
        id: interaction.user.id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      },
      {
        id: '992834114199756941',
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      },
      {
        id: interaction.guild.roles.everyone,
        deny: ['VIEW_CHANNEL'],
      },
    ],
    type: 'text',
    }).then(async c => {
    interaction.reply({
      content: `Ticket crée ! <#${c.id}>`,
      ephemeral: true
    });
    
    const embed = new MessageEmbed()
      .setColor('6d6ee8')
      .setDescription('Choisis la catégorie du ticket')
      .setTimestamp();
    
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
        .setCustomId('category')
        .setPlaceholder('Choisis la catégorie du ticket')
        .addOptions([{
            label: 'Bug',
            value: 'Bug',
            emoji: '🔧',
          },
          {
            label: 'Réclamations',
            value: 'Réclamations',
            emoji: '💵',
          },
          {
            label: 'Joueurs',
            value: 'Joueurs',
            emoji: '🙂',
          },
          {
            label: 'Autres',
            value: 'Autres',
            emoji: '🤖',
          },
        ]),
      );
    
    msg = await c.send({
      content: `<@!${interaction.user.id}>`,
      embeds: [embed],
      components: [row]
    });
    
    const collector = msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 20000 //20 seconds
    });
    
    collector.on('collect', i => {
      if (i.user.id === interaction.user.id) {
        if (msg.deletable) {
          msg.delete().then(async () => {
            const embed = new MessageEmbed()
              .setColor('6d6ee8')
              .setDescription(`<@!${interaction.user.id}> A crée un ticket avec la catégorie \`${i.values[0]}\``)
              .setTimestamp();
    
            const row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                .setCustomId('close-ticket')
                .setLabel('Fermer')
                .setEmoji('✖')
                .setStyle('DANGER'),
              );
    
            const opened = await c.send({
              content: `<@&992834114199756941>`,
              embeds: [embed],
              components: [row]
            });
    
            opened.pin().then(() => {
              opened.channel.bulkDelete(1);
            });
          });
        };
      };
    });
    
    collector.on('end', collected => {
      if (collected.size < 1) {
        c.send(`Pas de catégorie selectionnée... Fermeture du ticket.`).then(() => {
          setTimeout(() => {
            if (c.deletable) {
              c.delete();
            };
          }, 5000);
        });
      };
    });
    });
    };
    
    if (interaction.customId == "close-ticket") {
    const guild = client.guilds.cache.get(interaction.guildId);
    const chan = guild.channels.cache.get(interaction.channelId);
    
    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('confirm-close')
      .setLabel('Fermer')
      .setStyle('DANGER'),
      new MessageButton()
      .setCustomId('Cancel')
      .setLabel('Annuler')
      .setStyle('SECONDARY'),
    );
    
    const verif = interaction.reply({
    content: 'Es-tu vraiment sur de fermer le ticket ?',
    components: [row]
    });
    
    const collector = interaction.channel.createMessageComponentCollector({
    componentType: 'BUTTON',
    time: 10000
    });
    
    collector.on('collect', i => {
    if (i.customId == 'confirm-close') {
      interaction.editReply({
        content: `Ticket fermé par <@!${interaction.user.id}>`
      });
    
      chan.edit({
          name: `closed-${chan.name}`,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
              id: '992834114199756941',
              allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ['VIEW_CHANNEL'],
            },
          ],
        })
        .then(async () => {
          const embed = new MessageEmbed()
            .setColor('6d6ee8')
            .setDescription('```Résumé du ticket```')
            .setTimestamp();
    
          const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setCustomId('delete-ticket')
              .setLabel('Supprimer')
              .setEmoji('🗑️')
              .setStyle('DANGER'),
            );
    
          chan.send({
            embeds: [embed],
            components: [row]
          });
        });
    
      collector.stop();
    };
    if (i.customId == 'no') {
      interaction.editReply({
        content: 'Ticket non supprimé !',
        components: []
      });
      collector.stop();
    };
    });
    
    collector.on('end', (i) => {
    if (i.size < 1) {
      interaction.editReply({
        content: 'Ticket non supprimé !',
        components: []
      });
    };
    });
    };
    
    if (interaction.customId == "delete-ticket") {
    const guild = client.guilds.cache.get(interaction.guildId);
    const chan = guild.channels.cache.get(interaction.channelId);
    
    interaction.reply({
    content: 'Sauvegarde des messages...'
    });
    
    chan.messages.fetch().then(async (messages) => {
    let a = messages.filter(m => m.author.bot !== true).map(m =>
      `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
    ).reverse().join('\n');
    if (a.length < 1) a = "Rien"
    var paste = new PrivateBinClient("https://privatebin.net/");
    var result = await paste.uploadContent(a, {uploadFormat: 'markdown'})
        const embed = new MessageEmbed()
          .setDescription(`📰 Logs du ticket \`${chan.id}\` | Crée par <@!${chan.topic}> | Fermé par <@!${interaction.user.id}>\n\nLogs: [**Clique ici pour voir les logs**](${getPasteUrl(result)})`)
          .setColor('#2f3136')
          .setTimestamp();
    
        const embed2 = new MessageEmbed()
          .setDescription(`📰 Logs du ticket \`${chan.id}\`: [**Clique ici pour avoir les logs**](${getPasteUrl(result)})`)
          .setColor('#2f3136')
          .setTimestamp();
    
        const webhookClient = new WebhookClient({ id: '995390483322896566', token: '8DuoKVHBYnrLkes3AbsvmvbflJnutw3B6NXSloPQcpTcwqyRNm6Yt1Gjh6SgsNYGdyFK' });
          
          webhookClient.send({
            username: 'Logs tickets',
            avatarURL: 'https://i.imgur.com/iyGGOIx.png',
            embeds: [embed],
          });
        chan.send('Supprime le salon...');
    
        setTimeout(() => {
          chan.delete();
        }, 5000);
      });
    };
    }) 
    },

    callback: async ({ message }) => {

        const channel = message.mentions.channels.first()
        const embed = new MessageEmbed()
        .setColor('6d6ee8')
        .setTitle('Ticket')
        .setDescription('Clique sur le bouton en dessous pour ouvrir un ticket.')
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId('open-ticket')
          .setLabel('Ouvre un ticket')
          .setEmoji('✉️')
          .setStyle('PRIMARY'),
        );

      channel.send({
        embeds: [embed],
        components: [row]
      })
    }}

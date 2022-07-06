const Discord = require('discord.js')
const { Intents } = require('discord.js')
const fs = require('fs')
const dotenv = require('dotenv')
const WOKCommands = require('wokcommands')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv/config')
dotenv.config()

const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.on('ready', async (client) => {

  const guild = client.guilds.cache.get('992833515882283069')

  /*const userIds = new Set();

  for (const guild of client.guilds.cache.values()) {

      for (const member of (await guild.members.fetch()).values()) {


          const user = await client.users.fetch(member.id);

          if (!userIds.has(user.id) && !user.bot) {

              userIds.add(user.id);
          }
      }
  }

  const membrestotal = userIds.size;*/

  const status = [
    "Minecraft",
    `Inspecter ${client.guilds.cache.size} serveurs`,
    `Surveiller ${guild.memberCount} membres`,
    //``Surveille ${membrestotal} membres`,
    //`Mais je surveille que ${client.guild.memberCount} membres sur ce serveur`,
    `Prefix par défaut : le.`
            ];
setInterval(function(){
let stats = status[Math.floor(Math.random()*status.length)]
client.user.setActivity(stats, { type: "PLAYING" })
}, 5000)
    
    console.log(`Discord > A bien été connecté au compte Lebayk Bot !`)
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        testServers: ['928908030194634752'],
        botOwners: ['504315887541551104'],
        defaultLanguage: 'french',
        disabledDefaultCommands: [
            'help'
        ],
    })
    .setDefaultPrefix('le.')
})

function Savebdd() {
    fs.writeFile("./config/bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if (err) message.channel.send("Une erreur est survenue.");
  });
}

/* Distube */
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ],
    youtubeDL: false
  })

client.login(process.env.TOKEN)
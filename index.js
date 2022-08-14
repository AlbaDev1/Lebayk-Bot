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

  const guild = client.guilds.cache.get('980021196924006430')

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

  // Notifications Youtube
  const { getChannelVideos } = require('yt-channel-info')
  const db = require("megadb")
  const yt = new db.crearDB("yt")
  setInterval(async function(){
    const videos = await getChannelVideos("UC8avyyaUes-7YU_uVxXDjzg", 0)
    const thevideo = videos.items[0]
    const title = await yt.obtener("UC8avyyaUes-7YU_uVxXDjzg")
    if(title === thevideo.title) return
    if(title !== thevideo.title){
      yt.establecer("UC8avyyaUes-7YU_uVxXDjzg", thevideo.title)
      client.channels.cache.get("980021197871910921").send(`${thevideo.author} a sorti une nouvelle vidéo : **${thevideo.title}**\nhttps://www.youtube.com/watch?v=${thevideo.videoId}`)
    }
  }, 120000)

  // Notifications Twitch
  const TwitchApi = require("node-twitch").default;

  const twitch = new TwitchApi({
	  client_id: process.env.TWITCH_ID,
	  client_secret: process.env.TWITCH_TOKEN
  });

  setInterval(async function(){
    await twitch.getStreams({ channel: "lebayk" }).then(async data => {
        const r = data.data[0]

        const avatar = "https://static-cdn.jtvnw.net/jtv_user_pictures/81852c39-8dd3-431b-b0b0-2ded25da8e11-profile_image-70x70.jpeg"

        const schema = require("./schemas/twitchSchema")

        if(r !== undefined) {
            if(r.type === "live"){
              const embed = new Discord.MessageEmbed()
              .setAuthor(`${r.user_name}`)
              .setTitle(`${r.title}`)
              .setURL(`https://twitch.tv/${r.user_name}`)
              .addField("Game", `${r.game_name}`)
              .addField("Viewers", `${r.viewer_count}`)
              .setImage(`${r.getThumbnailUrl()}`)
              .setColor("BLURPLE")

              let data2 = await schema.findOne({ user: r.user_name, title : r.title})
              
              if(!data2){
                const newdata = new schema({
                  user: r.user_name,
                  title: `${r.title}`
                })

                await client.channels.cache.get("980021197871910921").send({ content: `${r.user_name} est en live ! Venez nous rejoindre ! \nhttps://twitch.tv/${r.user_name}`, embeds: [embed]})

                return await newdata.save()
              }

              if(data2.title === `${r.title}`) return

              await client.channels.cache.get("980021197871910921").send({ content: `${r.user_name} est en live ! Venez nous rejoindre ! \nhttps://twitch.tv/${r.user_name}`, embeds: [embed]})
              await schema.findOneAndUpdate({ user: r.user_name }, { title: r.title })
            }
        }
    })
}, 120000)

  mongoose.connect("mongodb+srv://albadev:lucas2012@cluster0.ed4gwtl.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true
  }).then(() => {
    console.log("Connecté a MongoDB !")
  }).catch((err) => {
    console.log("Une erreur est survenue lors de la connexion a MongoDB.")
    console.log("------------------------ erreur : ------------------------")
    console.log(err)
    console.log("----------------------------------------------------------")
  })

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

// Fonction de bienvenue

client.on("guildMemberAdd", ( member ) => {
  const welcome = "992862143441551440"
  const general = "992867717398941756"
  const rules = "992862190862352474"

  const welcomechannel = member.guild.channels.cache.get(welcome)
  const generalchannel = member.guild.channels.cache.get(general)

  welcomechannel.send(`Bienvenue <@${member.id}> sur ${member.guild.name} ! Tu es notre ${member.guild.memberCount}ème membre !`)

  member.send(`Bienvenue ! Penses a regarder le salon <#${rules}>`)
  generalchannel.send(`Souhaitez la bienvenue à ${member.user.username} !`)
})

client.login(process.env.TOKEN)

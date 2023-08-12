import config from 'config'
import { Client, GatewayIntentBits, TextChannel } from 'discord.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.on('ready', async () => {
  console.log(`ready: ${client.user?.tag}`)
})

client.on('threadCreate', async (thread) => {
  if (thread.guildId !== '597378876556967936') {
    return
  }
  thread.guild?.channels.fetch('903778475188576286').then(async (channel) => {
    if (!(channel instanceof TextChannel)) {
      return // テキストチャンネルのメッセージではない
    }
    const channelId = thread.parent?.id
    const threadName = thread.name
    const threadId = thread.id
    const threadOwner = await thread.fetchOwner()

    channel
      .send(
        `<#${channelId}> -> \`${threadName}\` (<#${threadId}>) が \`${threadOwner?.user?.tag}\` によって作成されました。`,
      )
      .then(() => {
        console.log('posted created thread message')
      })
  })
})

client.login(config.get('discordToken'))

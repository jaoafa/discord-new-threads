import { Client, GatewayIntentBits, ThreadChannel } from 'discord.js'
import { Logger } from '@book000/node-utils'
import { Configuration } from './config'

export class Discord {
  private config: Configuration
  public readonly client: Client

  constructor(config: Configuration) {
    const logger = Logger.configure('Discord.constructor')
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    })
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('threadCreate', (thread) => {
      this.onThreadCreate(thread).catch((error: unknown) => {
        logger.error('❌ Failed to handle threadCreate event', error as Error)
      })
    })

    this.config = config

    this.client.login(config.get('discord').token).catch((error: unknown) => {
      const logger = Logger.configure('Discord.constructor')
      logger.error('❌ Failed to login', error as Error)
    })
  }

  public getClient() {
    return this.client
  }

  public getConfig() {
    return this.config
  }

  public async close() {
    await this.client.destroy()
  }

  onReady() {
    const logger = Logger.configure('Discord.onReady')
    logger.info(`👌 ready: ${this.client.user?.tag}`)
  }

  async onThreadCreate(thread: ThreadChannel) {
    const logger = Logger.configure('Discord.onThreadCreate')
    const config = this.getConfig()

    const expectGuildId = config.get('discord').guildId
    if (thread.guildId !== expectGuildId) {
      return
    }

    const notifyChannelId = config.get('discord').channelId
    const notifyChannel = await this.client.channels.fetch(notifyChannelId)
    if (!notifyChannel) {
      logger.error(`❌ Not found notify channel: ${notifyChannelId}`)
      return
    }
    if (!notifyChannel.isTextBased()) {
      logger.error(`❌ Notify channel is not text channel: ${notifyChannelId}`)
      return
    }

    const channelId = thread.parentId
    const threadId = thread.id
    const threadName = thread.name
    const threadOwner = await thread.fetchOwner()
    const threadOwnerName = threadOwner?.user?.username

    const content = `<#${channelId}> -> \`${threadName}\` (<#${threadId}>) が \`${threadOwnerName}\` によって作成されました。`
    await notifyChannel.send(content)
  }

  waitReady() {
    return new Promise<void>((resolve) => {
      if (this.client.isReady()) {
        resolve()
      }
      this.client.once('ready', () => {
        resolve()
      })
    })
  }
}

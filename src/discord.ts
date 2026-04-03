import { Client, GatewayIntentBits, ThreadChannel } from 'discord.js'
import { Logger } from '@book000/node-utils'
import { Configuration } from './config'

/**
 * Discord クライアントを管理し、スレッド作成通知を送信します。
 */
export class Discord {
  private config: Configuration
  public readonly client: Client

  /**
   * Discord クライアントを初期化します。
   *
   * @param config 設定オブジェクト
   */
  constructor(config: Configuration) {
    const logger = Logger.configure('Discord.constructor')
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    })
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('threadCreate', (thread) => {
      this.onThreadCreate(thread).catch((err: unknown) => {
        logger.error('❌ Failed to handle threadCreate event', err as Error)
      })
    })

    this.config = config

    this.client.login(config.get('discord').token).catch((err: unknown) => {
      const logger = Logger.configure('Discord.constructor')
      logger.error('❌ Failed to login', err as Error)
    })
  }

  /**
   * Discord クライアントを取得します。
   *
   * @returns Discord クライアント
   */
  public getClient() {
    return this.client
  }

  /**
   * アプリケーション設定を取得します。
   *
   * @returns 設定オブジェクト
   */
  public getConfig() {
    return this.config
  }

  /**
   * Discord クライアントを終了します。
   *
   * @returns クライアント終了処理
   */
  public async close() {
    await this.client.destroy()
  }

  /**
   * Discord の ready イベントを処理します。
   */
  onReady() {
    const logger = Logger.configure('Discord.onReady')
    logger.info(`👌 ready: ${this.client.user?.tag}`)
  }

  /**
   * スレッド作成時に通知メッセージを送信します。
   *
   * @param thread 作成されたスレッド
   */
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
    if (!notifyChannel.isSendable()) {
      logger.error(`❌ Notify channel is not sendable: ${notifyChannelId}`)
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

  /**
   * Discord クライアントが ready になるまで待機します。
   *
   * @returns ready 完了までの Promise
   */
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

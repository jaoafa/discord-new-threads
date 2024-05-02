import { ConfigFramework } from '@book000/node-utils'

export interface ConfigInterface {
  discord: {
    token: string
    guildId: string
    channelId: string
  }
}

export class Configuration extends ConfigFramework<ConfigInterface> {
  protected validates(): Record<string, (config: ConfigInterface) => boolean> {
    return {
      'discord is required': (config) => !!config.discord,
      'discord.token is required': (config) => !!config.discord.token,
      'discord.token must be a string': (config) =>
        typeof config.discord.token === 'string',
      'discord.guildId is required': (config) => !!config.discord.guildId,
      'discord.guildId must be a string': (config) =>
        typeof config.discord.guildId === 'string',
      'discord.channelId is required': (config) => !!config.discord.channelId,
      'discord.channelId must be a string': (config) =>
        typeof config.discord.channelId === 'string',
    }
  }
}

# discord-new-threads

Discord サーバーで新しいスレッドが作成されたときに、指定したテキストチャンネルへ通知する Bot です。

## 設定

`data/config.json` を作成します。パスは環境変数 `CONFIG_PATH` で変更できます（Docker イメージでは `/data/config.json`）。

```json
{
  "discord": {
    "token": "Bot のトークン",
    "guildId": "監視するサーバーの ID",
    "channelId": "通知を送信するチャンネルの ID"
  }
}
```

3 項目とも必須の文字列です。`guildId` 以外のサーバーで作成されたスレッドは無視されます。

## 実行

```bash
pnpm install
pnpm start      # 通常起動
pnpm dev        # ファイル変更を監視して再起動
```

Docker Compose では、`./data` を `/data` にマウントして起動します。

```bash
docker compose up -d --build
```

## 開発

```bash
pnpm lint       # prettier / eslint / tsc
pnpm fix        # prettier / eslint の自動修正
```

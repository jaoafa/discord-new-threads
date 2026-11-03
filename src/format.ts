/**
 * ユーザー由来の値をインラインコードに安全に埋め込める形へ変換する。
 * バッククォートを置換してコードスパンが閉じないようにし、改行を空白へ畳んで通知を 1 行に保つ。
 * @param value 元の値
 * @returns 変換後の値。空になる場合は `-`
 */
function toInlineCodeText(value: string): string {
  const sanitized = value.replaceAll('`', 'ˋ').replaceAll(/[\n\r]+/g, ' ')
  return sanitized === '' ? '-' : sanitized
}

/**
 * スレッド作成通知のメッセージを組み立てる。
 * @param params 通知パラメータ
 * @param params.channelId スレッドの親チャンネルの ID
 * @param params.threadId 作成されたスレッドの ID
 * @param params.threadName 作成されたスレッドの名前（信頼できない入力）
 * @param params.ownerName スレッド作成者のユーザー名（信頼できない入力）
 * @returns メッセージ本文
 */
export function buildThreadNotification(params: {
  channelId: string | null
  threadId: string
  threadName: string
  ownerName: string | undefined
}): string {
  const threadName = toInlineCodeText(params.threadName)
  const ownerName = toInlineCodeText(params.ownerName ?? 'unknown')
  return `<#${params.channelId}> -> \`${threadName}\` (<#${params.threadId}>) が \`${ownerName}\` によって作成されました。`
}

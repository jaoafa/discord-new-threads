/**
 * Makes a user-controlled value safe to embed in an inline code span.
 * Backticks are replaced so the value cannot close the span, and line breaks
 * are collapsed so the notification stays on one line.
 * @param value - The raw value
 * @returns The sanitized value, or `-` if nothing remains
 */
function toInlineCodeText(value: string): string {
  const sanitized = value.replaceAll('`', 'ˋ').replaceAll(/[\n\r]+/g, ' ')
  return sanitized === '' ? '-' : sanitized
}

/**
 * Builds the new-thread notification message.
 * @param params - Notification parameters
 * @param params.channelId - ID of the channel the thread belongs to
 * @param params.threadId - ID of the created thread
 * @param params.threadName - Name of the created thread (untrusted)
 * @param params.ownerName - Username of the thread owner (untrusted)
 * @returns The message content
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

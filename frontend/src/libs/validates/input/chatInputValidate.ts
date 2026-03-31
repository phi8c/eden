export function validateChatMessageInput(content: string) {
     if (content === undefined || content === null) {
    return "Message cannot be empty"
  }
const trimmed = content.trim()
if (trimmed.length ===0) {
    return "Message connot be empty"
}
if (trimmed.length > 2000) {
    return "Message too long"
}
return null

}
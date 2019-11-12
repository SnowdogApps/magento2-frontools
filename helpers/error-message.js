import colors from 'ansi-colors'

export default function() {
  return message => {
    const lineLength = message.length > 50 ? 50 : message.length
    return `
      ${colors.red('\n' + '='.repeat(lineLength) + ' \n')}
      ${colors.yellow(message)}
      ${colors.red('\n' + '='.repeat(lineLength))}
    `
  }
}

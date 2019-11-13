import colors from 'ansi-colors'

export default message => {
  const lineLength = message.length > 50 ? 50 : message.length
  return `
    ${colors.red('='.repeat(lineLength))}
    ${colors.yellow(message)}
    ${colors.red('='.repeat(lineLength))}
  `
}

import PluginError from 'plugin-error'

export default fail => {
  return function(error) { // eslint-disable-line func-names
    const message = new PluginError('sass', error.messageFormatted).toString()

    // Throw error instead of logging it if module is set to fail on error
    if (fail) {
      throw message
    }

    process.stderr.write(message + '\n')
    this.emit('end')
  }
}

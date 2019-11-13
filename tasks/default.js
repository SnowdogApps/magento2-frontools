import fs from 'fs-extra'
import marked from 'marked'
import markedTerminal from 'marked-terminal'
import log from 'fancy-log'

export default function(callback) {
  // Display formatted readme.md
  marked.setOptions({
    renderer: new markedTerminal()
  })

  log.info(marked(fs.readFileSync('./README.md', 'UTF-8')))

  callback()
}

import fs from 'fs-extra'
import marked from 'marked'
import markedTerminal from 'marked-terminal'

export default function(callback) {
  // Display formatted readme.md
  marked.setOptions({
    renderer: new markedTerminal()
  })

  // eslint-disable-next-line no-console
  console.log(marked(fs.readFileSync('./README.md', 'UTF-8')))

  callback()
}

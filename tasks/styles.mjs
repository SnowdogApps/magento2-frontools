import mergeStream from 'merge-stream'
import helper from '../helpers/scss.mjs'
import themes from '../helpers/get-themes.mjs'

export const styles = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helper(name))
  })
  return streams
}

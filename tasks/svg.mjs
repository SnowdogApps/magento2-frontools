import mergeStream from 'merge-stream'
import helper from '../helpers/svg.mjs'
import themes from '../helpers/get-themes.mjs'

export const svg = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helper(name))
  })
  return streams
}

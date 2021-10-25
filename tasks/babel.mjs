import mergeStream from 'merge-stream'
import helper from '../helpers/babel.mjs'
import themes from '../helpers/get-themes.mjs'

export const babel = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helper(name))
  })
  return streams
}

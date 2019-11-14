import mergeStream from 'merge-stream'
import helper from '../helpers/babel'
import themes from '../helpers/get-themes'

export const babel = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helper(name))
  })
  return streams
}

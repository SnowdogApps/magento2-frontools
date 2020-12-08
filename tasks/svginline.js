import mergeStream from 'merge-stream'
import helper from '../helpers/svginline'
import themes from '../helpers/get-themes'

export const svginline = () => {
  const streams = mergeStream()
  themes().forEach(name => {
    streams.add(helper(name))
  })
  return streams
}

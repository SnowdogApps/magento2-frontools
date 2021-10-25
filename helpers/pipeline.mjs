import { env } from './config.mjs'

export default callback => {
  env.pipeline = true
  callback()
}

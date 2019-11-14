import { env } from './config'

export default callback => {
  env.pipeline = true
  callback()
}

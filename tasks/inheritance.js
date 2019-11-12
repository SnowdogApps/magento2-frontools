import themes from '../helpers/get-themes'
import inheritanceResolver from '../helpers/inheritance-resolver'

import { env } from '../helpers/config'

export const inheritance = async() => {
  if (!env.pipeline) {
    await Promise.all(
      themes.map(name => inheritanceResolver(name))
    )
  }
}

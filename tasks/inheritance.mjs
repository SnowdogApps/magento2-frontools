import themes from '../helpers/get-themes.mjs'
import inheritanceResolver from '../helpers/inheritance-resolver.mjs'

import { env } from '../helpers/config.mjs'

export const inheritance = async() => {
  if (!env.pipeline) {
    await Promise.all(
      themes().map(name => inheritanceResolver(name))
    )
  }
}

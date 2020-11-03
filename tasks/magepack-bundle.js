import bundle from 'magepack/lib/bundle'

import { env } from '../helpers/config'

export default async function() {
  const configPath = env.c || env.config
  await bundle(configPath)
}

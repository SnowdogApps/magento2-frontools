import generate from 'magepack/lib/generate'

import { env } from '../helpers/config'

export default async function() {
  const config = {
    cmsUrl: env['cms-url'],
    categoryUrl: env['category-url'],
    productUrl: env['product-url'],
    authUsername: env.u || env['auth-username'],
    authPassword: env.p || env['auth-password'],
    debug: env.d || env.debug || false
  }

  await generate(config)
}

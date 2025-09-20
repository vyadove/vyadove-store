// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { plugins } from './plugins'
import { Orders } from './collections/Orders/Orders'
import { Collections } from './collections/Collections'
import { Products } from './collections/Products/Products'
import { Campaigns } from './collections/Campaigns/Campaigns'
import { Policies } from './collections/Policies'
import { GiftCards } from './collections/GiftCards'
import { Payments } from './collections/Payments'
import { Locations } from './collections/Locations'
import { Shipping } from './collections/Shipping'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Orders,
    Collections,
    Products,
    Users,
    Campaigns,
    Media,
    Policies,
    GiftCards,
    Payments,
    Locations,
    Shipping,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
})

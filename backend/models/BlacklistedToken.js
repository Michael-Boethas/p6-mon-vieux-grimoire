import mongoose from 'mongoose'

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } } // Expiration automatique (MongoDB TTL index)
  },
  { collection: 'tokenBlacklist' }
)

export default mongoose.model('BlacklistedToken', blacklistedTokenSchema)
;``

/* global Configurations */

// port
process.env.PORT = process.env.PORT || 3000

// envairoment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// expiring token
process.env.TOKEN_EXPIRES = 60 * 60 * 60 * 30

// seeds
let usrSEED: any

process.env.MODE_ENV === 'dev'
  ? (usrSEED = 'devsercret')
  : (usrSEED = process.env.SEED_TOKEN)

process.env.USER_SECRET = usrSEED

// database
let urlDB: any

process.env.NODE_ENV === 'dev'
  ? (urlDB = 'mongodb://localhost:27017/inventory')
  : (urlDB = process.env.MONGO_URI)

process.env.URLDB = urlDB

// googleid

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '274383636599-877ud7tg19b1lvifvabqf0uev40oh40j.apps.googleusercontent.com'

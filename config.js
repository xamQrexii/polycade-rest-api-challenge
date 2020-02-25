require('dotenv').config()

exports.config = {
  DB_NAME: process.env.DB_NAME || 'polycade',
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '123456',
  DB_HOST_NAME: process.env.DB_HOST_NAME || 'localhost'
}

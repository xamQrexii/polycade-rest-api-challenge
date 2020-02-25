import Sequelize from 'sequelize'
import { config } from '../../config'

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST_NAME,
    dialect: 'postgres'
  }
)

exports.sequelize = sequelize

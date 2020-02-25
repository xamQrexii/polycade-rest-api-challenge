import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/db.connection'

class PricingConfiguration extends Model {}

PricingConfiguration.init(
  {
    price: DataTypes.DOUBLE,
    name: DataTypes.STRING,
    value: DataTypes.DOUBLE
  },
  { sequelize, modelName: 'pricingconfiguration' }
)

exports.PricingConfiguration = PricingConfiguration

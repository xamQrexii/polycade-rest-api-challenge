import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/db.connection'
import { PricingConfiguration } from './pricing-configuration.model'

class Price extends Model {}

Price.init(
  {
    name: DataTypes.STRING
  },
  { sequelize, modelName: 'price' }
)

Price.hasMany(PricingConfiguration, {
  foreignKey: 'pricing_id',
  sourceKey: 'id',
  as: 'pricing',
  onDelete: 'CASCADE'
})

exports.Price = Price

import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../database/db.connection'
import { Price } from './price.model'

class Machine extends Model {}

Machine.init(
  {
    name: DataTypes.STRING
  },
  { sequelize, modelName: 'machine' }
)

Machine.belongsTo(Price, {
  foreignKey: 'pricing_id'
})

exports.Machine = Machine

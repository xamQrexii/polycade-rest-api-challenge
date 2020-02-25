import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import { sequelize } from './database/db.connection'
import { Price } from './models/price.model'
import { PricingConfiguration } from './models/pricing-configuration.model'
import { Machine } from './models/machine.model'

import machineRoutes from './routes/machine.route'
import pricingRoutes from './routes/pricing.route'

const app = new Koa()
const PORT = process.env.PORT || 1337
app.use(bodyParser())

// database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(machineRoutes.routes())
app.use(pricingRoutes.routes())

const server = app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)
  try {
    await Price.sync()
    await PricingConfiguration.sync()
    await Machine.sync()
  } catch (err) {
    console.log(`Sequelize error: ${err.message}`)
  }
})

module.exports = server

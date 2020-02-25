const request = require('supertest')
const server = require('../src/index.js')

const BASE_URL = '/machines'

const pricingModels = require('../prices.json')

const { sequelize: db } = require('../src/database/db.connection.js')

const { Price } = require('../src/models/price.model')
const { Machine } = require('../src/models/machine.model.js')
const {
  PricingConfiguration
} = require('../src/models/pricing-configuration.model.js')

let VALID_MACHINE_ID
let VALID_MACHINE_ID_WITHOUT_PRICING
let VALID_PRICING_ID
let VALID_PRICE_CONFIG_ID

beforeAll(async () => {
  const pricing = await Price.create({
    name: 'Test'
  })
  const priceConf = await PricingConfiguration.create({
    name: 'Test',
    value: 1,
    cost: 1,
    pricing_id: pricing.id
  })
  const machineWithPricing = await Machine.create({
    name: 'Test Machine',
    pricing_id: pricing.id
  })
  const machineWithoutPricing = await Machine.create({
    name: 'Test Machine without pricing'
  })
  VALID_PRICING_ID = pricing.id
  VALID_PRICE_CONFIG_ID = priceConf.id
  VALID_MACHINE_ID = machineWithPricing.id
  VALID_MACHINE_ID_WITHOUT_PRICING = machineWithoutPricing.id
  console.log('Jest starting!')
})

// close the server after each test
afterAll(async () => {
  await Machine.destroy({ where: { id: VALID_MACHINE_ID } })
  await Machine.destroy({ where: { id: VALID_MACHINE_ID_WITHOUT_PRICING } })
  await PricingConfiguration.destroy({
    where: { id: VALID_PRICE_CONFIG_ID }
  })
  await Price.destroy({ where: { id: VALID_PRICING_ID } })
  await db.close()
  server.close()
  console.log('server closed!')
})

describe('get endpoints of machines', () => {
  test('get machine pricing model and pricing configuration', async () => {
    const response = await request(server).get(
			`${BASE_URL}/${VALID_MACHINE_ID}/prices`
    )
    expect(response.status).toEqual(200)
    expect(response.body.name).toBeTruthy()
    expect(response.body.pricing).toBeTruthy()
  })
  test('get machine pricing model without it configured that returns default pricing model', async () => {
    const response = await request(server).get(
			`${BASE_URL}/${VALID_MACHINE_ID_WITHOUT_PRICING}/prices`
    )
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(pricingModels.default_pricing)
  })
})

describe('put endpoints of machines', () => {
  test('put machine to update pricing model', async () => {
    const response = await request(server).put(
			`${BASE_URL}/${VALID_MACHINE_ID}/prices/${VALID_PRICING_ID}`
    )
    expect(+response.body.pricing_id).toEqual(VALID_PRICING_ID)
  })
  test('put machine with invalid machineId should return not found', async () => {
    const invalidId = -1
    const response = await request(server).put(
			`${BASE_URL}/${invalidId}/prices/${VALID_PRICING_ID}`
    )
    expect(response.status).toEqual(404)
  })
  test('put machine with invalid pricingModelId should return not found', async () => {
    const invalidId = -1
    const response = await request(server).put(
			`${BASE_URL}/${VALID_MACHINE_ID}/prices/${invalidId}`
    )
    expect(response.status).toEqual(404)
  })
})

describe('delete endpoints of machines', () => {
  test('delete pricing model from machine', async () => {
    const response = await request(server).delete(
			`${BASE_URL}/${VALID_MACHINE_ID}/prices/${VALID_PRICING_ID}`
    )
    expect(response.body.pricing_id).toBeFalsy()
  })
})

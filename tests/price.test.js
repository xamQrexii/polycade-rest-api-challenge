const request = require('supertest')
const server = require('../src/index.js')

const BASE_URL = '/pricing-models'

const pricingModels = require('../prices.json')

const { sequelize: db } = require('../src/database/db.connection.js')

const { Price } = require('../src/models/price.model')
const { Machine } = require('../src/models/machine.model.js')
const {
  PricingConfiguration
} = require('../src/models/pricing-configuration.model.js')

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
  VALID_PRICING_ID = pricing.id
  VALID_PRICE_CONFIG_ID = priceConf.id
  // do something before anything else runs
  console.log('Jest starting!')
})

// close the server after each test
afterAll(async () => {
  await PricingConfiguration.destroy({
    where: { id: VALID_PRICE_CONFIG_ID }
  })
  await Price.destroy({ where: { id: VALID_PRICING_ID } })
  db.close()
  server.close()
  console.log('server closed!')
})

describe('get endpoints of pricing models', () => {
  test('get all pricing models', async () => {
    const response = await request(server).get(BASE_URL)
    expect(response.status).toEqual(200)
  })
  test('get pricing model by id with invalid id should return not found', async () => {
    const invalidId = -1
    const response = await request(server).get(`${BASE_URL}/${invalidId}`)
    expect(response.status).toEqual(404)
  })
  test('get pricing model by id with valid id should return pricing model', async () => {
    const response = await request(server).get(
			`${BASE_URL}/${VALID_PRICING_ID}`
    )
    expect(response.status).toEqual(200)
    expect(response.body.name).toBeTruthy()
  })
  test('get pricing configuration for a specific pricing model', async () => {
    const response = await request(server).get(
			`${BASE_URL}/${VALID_PRICING_ID}/prices`
    )
    expect(response.status).toEqual(200)
    expect(response.body).toBeTruthy()
  })
})

describe('post endpoints of pricing models', () => {
  test('post pricing model', async () => {
    const pricingModel = { name: 'New pricing model' }
    const response = await request(server)
      .post(BASE_URL)
      .send(pricingModel)
    expect(response.status).toEqual(201)
    expect(response.body.id).toBeTruthy()
  })
  test('post new pricing configuration', async () => {
    const priceConfiguration = {
      price: 3,
      name: '10 minutes',
      value: 10
    }
    const response = await request(server)
      .post(`${BASE_URL}/${VALID_PRICING_ID}/prices`)
      .send(priceConfiguration)
    expect(response.status).toEqual(201)
  })
})

describe('put endpoints of pricing models', () => {
  test('put pricing model', async () => {
    const pricingModel = { name: 'New name', pricing: [-1] }
    const response = await request(server)
      .put(`${BASE_URL}/${VALID_PRICING_ID}`)
      .send(pricingModel)
    expect(response.body.name).toEqual(pricingModel.name)
    expect(response.body.pricing).not.toEqual(pricingModel.pricing)
  })
})

describe('delete endpoints of pricing models', () => {
  test('delete pricing model configuration from pricing model', async () => {
    const beforeDeleteResponse = await request(server).get(
			`${BASE_URL}/${VALID_PRICING_ID}/prices`
    )
    const beforeDeletePricingConfig = beforeDeleteResponse.body
    const response = await request(server).delete(
			`${BASE_URL}/${VALID_PRICING_ID}/prices/${VALID_PRICE_CONFIG_ID}`
    )
    expect(response.status).toEqual(204)
  })
  test('delete pricing model configuration from pricing model with invalid pmId should return not found', async () => {
    const invalidId = -1
    const response = await request(server).delete(
			`${BASE_URL}/${invalidId}/prices/${VALID_PRICE_CONFIG_ID}`
    )
    expect(response.status).toEqual(404)
  })
  test('delete pricing model configuration from pricing model with invalid priceId should return not found', async () => {
    const invalidId = -1
    const response = await request(server).delete(
			`${BASE_URL}/${VALID_PRICE_CONFIG_ID}/prices/${invalidId}`
    )
    expect(response.status).toEqual(404)
  })
})

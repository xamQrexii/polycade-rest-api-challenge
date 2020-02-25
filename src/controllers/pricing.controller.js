import { Price } from '../models/price.model'
import { PricingConfiguration } from '../models/pricing-configuration.model'
const defaultPricingModel = require('../../prices.json').default_pricing

exports.getPricingModels = async ctx => {
  try {
    let pricingModels = await Price.findAll({
      include: [
        {
          model: PricingConfiguration,
          as: 'pricing'
        }
      ]
    })
    if (!pricingModels) {
      pricingModels = []
    }
    pricingModels.push(defaultPricingModel)
    ctx.status = 200
    ctx.body = pricingModels
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.createPricingModels = async ctx => {
  const pricingModel = ctx.request.body
  console.log(pricingModel)
  try {
    const pricingModelInDB = await Price.create(
      {
        name: pricingModel.name,
        pricing: pricingModel.pricing
      },
      { include: [{ model: PricingConfiguration, as: 'pricing' }] }
    )
    ctx.status = 201
    ctx.body = { id: pricingModelInDB.id }
  } catch (e) {
    ctx.throw(JSON.stringify({ success: false, message: e.message }))
  }
}

exports.getIndividualPricingModel = async ctx => {
  const pricingModelId = ctx.params.pmId
  try {
    const pricingModel = await Price.findByPk(pricingModelId, {
      include: [{ model: PricingConfiguration, as: 'pricing' }]
    })
    if (pricingModel) {
      ctx.body = pricingModel
    } else {
      ctx.throw(404, 'Pricing model does not exist.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.updatePricingModel = async ctx => {
  const pricingModelId = ctx.params.pmId
  try {
    const pricingModelFromDB = await Price.findByPk(pricingModelId, {
      include: [{ model: PricingConfiguration, as: 'pricing' }]
    })

    if (pricingModelFromDB) {
      const pricingModelFromClient = ctx.request.body
      await pricingModelFromDB.update({
        name: pricingModelFromClient.name
      })
      ctx.body = pricingModelFromDB
    } else {
      ctx.throw(404, 'Pricing model does not exist.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.getPricingForPricingModel = async ctx => {
  const pricingModelId = ctx.params.pmId
  try {
    const pricingConfigurations = await PricingConfiguration.findAll({
      where: { pricing_id: pricingModelId }
    })
    if (pricingConfigurations) {
      ctx.body = pricingConfigurations
    } else {
      ctx.throw(404, 'Pricing model does not exist.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.addNewPricingConfiguration = async ctx => {
  const pricingModelId = ctx.params.pmId
  try {
    const pricingModel = await Price.findByPk(pricingModelId)
    if (pricingModel) {
      const priceConfiguration = ctx.request.body
      await PricingConfiguration.create({
        name: priceConfiguration.name,
        price: priceConfiguration.price,
        value: priceConfiguration.value,
        pricing_id: pricingModelId
      })
      ctx.status = 201
    } else {
      ctx.throw(404, 'Pricing model does not exist.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.deletePricingConfiguration = async ctx => {
  const pricingModelId = ctx.params.pmId
  try {
    const pricingModel = await Price.findByPk(pricingModelId)
    if (pricingModel) {
      const priceConfigIdToDelete = ctx.params.priceId
      const priceConfig = await PricingConfiguration.findByPk(
        priceConfigIdToDelete
      )
      if (!priceConfig) {
        ctx.throw(404, 'Price configuration not found')
        return
      }
      await priceConfig.destroy()
      ctx.status = 204
    } else {
      ctx.throw(404, 'Pricing model does not exist.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

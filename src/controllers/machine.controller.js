import { Machine } from '../models/machine.model'
import { Price } from '../models/price.model'
import { PricingConfiguration } from '../models/pricing-configuration.model'

const pricingModels = require('../../prices.json')

exports.updateMachinePricingModel = async ctx => {
  const machineId = ctx.params.machineId
  try {
    const machine = await Machine.findByPk(machineId)
    if (machine) {
      const pricingModelId = ctx.params.pmId
      const pricingModel = await Price.findByPk(pricingModelId)
      if (pricingModel) {
        await machine.update({ pricing_id: pricingModelId })
        ctx.body = machine
      } else {
        ctx.throw(404, 'Pricing model not found.')
      }
    } else {
      ctx.throw(404, 'Machine not found.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.deleteMachinePricingModel = async ctx => {
  const machineId = ctx.params.machineId
  try {
    const machine = await Machine.findByPk(machineId)
    if (machine) {
      await machine.update({ pricing_id: null })
      ctx.body = machine
    } else {
      ctx.throw(404, 'Machine not found.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

exports.getMachinePricingModel = async ctx => {
  const machineId = ctx.params.machineId
  try {
    const machine = await Machine.findByPk(machineId)
    if (machine) {
      const pricingModelIdOfMachine = machine.pricing_id
      const pricingModel = await Price.findByPk(pricingModelIdOfMachine, {
        include: [{ model: PricingConfiguration, as: 'pricing' }]
      })
      if (pricingModel) {
        ctx.body = pricingModel
      } else {
        ctx.body = pricingModels.default_pricing
      }
    } else {
      ctx.throw(404, 'Machine not found.')
    }
  } catch (e) {
    ctx.throw(404, JSON.stringify({ success: false, message: e.message }))
  }
}

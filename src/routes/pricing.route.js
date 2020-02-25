import Router from 'koa-router'

import {
  getPricingModels,
  createPricingModels,
  getIndividualPricingModel,
  updatePricingModel,
  getPricingForPricingModel,
  addNewPricingConfiguration,
  deletePricingConfiguration
} from '../controllers/pricing.controller'

// prefix routes
const router = new Router({
  prefix: '/pricing-models'
})

router.get('/', getPricingModels)
router.post('/', createPricingModels)
router.get('/:pmId', getIndividualPricingModel)
router.put('/:pmId', updatePricingModel)
router.get('/:pmId/prices', getPricingForPricingModel)
router.post('/:pmId/prices', addNewPricingConfiguration)
router.delete('/:pmId/prices/:priceId', deletePricingConfiguration)

module.exports = router

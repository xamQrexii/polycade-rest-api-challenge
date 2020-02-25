import Router from 'koa-router'

import {
  updateMachinePricingModel,
  deleteMachinePricingModel,
  getMachinePricingModel
} from '../controllers/machine.controller'

// prefix routes
const router = new Router({
  prefix: '/machines'
})

// machine routes
router.put('/:machineId/prices/:pmId', updateMachinePricingModel)
router.delete('/:machineId/prices/:pmId', deleteMachinePricingModel)
router.get('/:machineId/prices', getMachinePricingModel)

module.exports = router

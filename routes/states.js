// routes/states.js (CommonJS)
const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyState = require('../middleware/verifyState');

// /states/
router.route('/')
  .get(statesController.getAllStates);

// /states/:state
router.route('/:state')
  .get(verifyState, statesController.getState);

// /states/:state/funfact
router.route('/:state/funfact')
  .get(verifyState, statesController.getRandomFunFact)
  .post(verifyState, statesController.postFunFacts)
  .patch(verifyState, statesController.patchFunFact)
  .delete(verifyState, statesController.deleteFunFact);

// /states/:state/[property]
router.get('/:state/capital', verifyState, statesController.getCapital);
router.get('/:state/nickname', verifyState, statesController.getNickname);
router.get('/:state/population', verifyState, statesController.getPopulation);
router.get('/:state/admission', verifyState, statesController.getAdmission);

module.exports = router;

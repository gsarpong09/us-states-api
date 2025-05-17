// routes/states.js (CommonJS)
const express = require('express');
const router = express.Router();

const {
  getAllStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  getRandomFunFact,
  postFunFacts,
  patchFunFact,
  deleteFunFact
} = require('../controllers/statesController');

const verifyState = require('../middleware/verifyState');

// Route: /states/
router.route('/')
  .get(getAllStates);

// Route: /states/:state
router.route('/:state')
  .get(verifyState, getState);

// Route: /states/:state/funfact
router.route('/:state/funfact')
  .get(verifyState, getRandomFunFact)
  .post(verifyState, postFunFacts)
  .patch(verifyState, patchFunFact)
  .delete(verifyState, deleteFunFact);

// Other /states/:state/X routes
router.get('/:state/capital', verifyState, getCapital);
router.get('/:state/nickname', verifyState, getNickname);
router.get('/:state/population', verifyState, getPopulation);
router.get('/:state/admission', verifyState, getAdmission);

module.exports = router;
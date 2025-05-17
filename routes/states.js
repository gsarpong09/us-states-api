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

// GET all states or filter by contig query
router.route('/').get(getAllStates);

// GET one state
router.route('/:state').get(verifyState, getState);

// GET / POST / PATCH / DELETE funfacts
router
  .route('/:state/funfact')
  .get(verifyState, getRandomFunFact)
  .post(verifyState, postFunFacts)
  .patch(verifyState, patchFunFact)
  .delete(verifyState, deleteFunFact);

// GET capital
router.get('/:state/capital', verifyState, getCapital);

// GET nickname
router.get('/:state/nickname', verifyState, getNickname);

// GET population
router.get('/:state/population', verifyState, getPopulation);

// GET admission date
router.get('/:state/admission', verifyState, getAdmission);

module.exports = router;

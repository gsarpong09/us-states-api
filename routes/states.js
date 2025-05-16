const express = require('express');
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

const router = express.Router();

router.route('/')
  .get(getAllStates);

router.route('/:state')
  .get(verifyState, getState);

router.route('/:state/funfact')
  .get(verifyState, getRandomFunFact)
  .post(verifyState, postFunFacts)
  .patch(verifyState, patchFunFact)
  .delete(verifyState, deleteFunFact);

router.get('/:state/capital', verifyState, getCapital);
router.get('/:state/nickname', verifyState, getNickname);
router.get('/:state/population', verifyState, getPopulation);
router.get('/:state/admission', verifyState, getAdmission);

module.exports = router;

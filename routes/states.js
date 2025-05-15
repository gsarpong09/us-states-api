import express from 'express';
import {
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
} from '../controllers/statesController.js';
import { verifyState } from '../middleware/verifyState.js';

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

export default router;

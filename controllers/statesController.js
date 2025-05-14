// controllers/statesController.js
import fs from 'fs';
import State from '../models/States.js';

const statesData = JSON.parse(
  fs.readFileSync(new URL('../data/statesData.json', import.meta.url))
);

function normalizeState(state) {
  return {
    state: state.state,
    code: state.code,
    capital: state.capital_city,
    nickname: state.nickname,
    population: state.population,
    admitted: state.admission_date,
  };
}

const getAllStates = async (req, res) => {
  let mergedStates = statesData.map(normalizeState);
  const dbStates = await State.find();

  mergedStates = mergedStates.map(state => {
    const match = dbStates.find(db => db.stateCode === state.code);
    if (match && match.funfacts?.length > 0) {
      return { ...state, funfacts: match.funfacts };
    }
    return { ...state };
  });

  if (req.query.contig === 'true') {
    mergedStates = mergedStates.filter(st => st.code !== 'AK' && st.code !== 'HI');
  } else if (req.query.contig === 'false') {
    mergedStates = mergedStates.filter(st => st.code === 'AK' || st.code === 'HI');
  }

  res.json(mergedStates);
};

const getState = async (req, res) => {
  const code = req.code;
  const rawState = statesData.find(st => st.code === code);
  if (!rawState) return res.status(404).json({ message: 'State not found' });

  const state = normalizeState(rawState);
  const dbState = await State.findOne({ stateCode: code });

  if (dbState?.funfacts?.length > 0) {
    state.funfacts = dbState.funfacts;
  }

  res.json(state);
};

const getCapital = (req, res) => {
  const state = statesData.find(st => st.code === req.code);
  res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
  const state = statesData.find(st => st.code === req.code);
  res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
  const state = statesData.find(st => st.code === req.code);
  res.json({ state: state.state, population: state.population });
};

const getAdmission = (req, res) => {
  const state = statesData.find(st => st.code === req.code);
  res.json({ state: state.state, admitted: state.admission_date });
};

const getRandomFunFact = async (req, res) => {
  const code = req.code;
  const state = statesData.find(st => st.code === code);
  if (!state) return res.status(400).json({ message: 'Invalid state abbreviation parameter' });

  const dbState = await State.findOne({ stateCode: code });
  if (!dbState?.funfacts || dbState.funfacts.length === 0) {
    return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
  }

  const random = dbState.funfacts[Math.floor(Math.random() * dbState.funfacts.length)];
  res.json({ funfact: random });
};

const postFunFacts = async (req, res) => {
  const facts = req.body.funfacts;
  if (!facts || !Array.isArray(facts)) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }

  const updated = await State.findOneAndUpdate(
    { stateCode: req.code },
    { $push: { funfacts: { $each: facts } } },
    { new: true, upsert: true }
  );

  res.json(updated);
};

const patchFunFact = async (req, res) => {
  const { index, funfact } = req.body;
  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
  if (!funfact) return res.status(400).json({ message: 'State fun fact value required' });

  const dbState = await State.findOne({ stateCode: req.code });
  if (!dbState?.funfacts || dbState.funfacts.length === 0) {
    return res.status(404).json({ message: `No Fun Facts found for ${req.code}` });
  }

  if (index < 1 || index > dbState.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${req.code}` });
  }

  dbState.funfacts[index - 1] = funfact;
  await dbState.save();
  res.json(dbState);
};

const deleteFunFact = async (req, res) => {
  const { index } = req.body;
  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });

  const dbState = await State.findOne({ stateCode: req.code });
  if (!dbState?.funfacts || dbState.funfacts.length === 0) {
    return res.status(404).json({ message: `No Fun Facts found for ${req.code}` });
  }

  if (index < 1 || index > dbState.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${req.code}` });
  }

  dbState.funfacts.splice(index - 1, 1);
  await dbState.save();
  res.json(dbState);
};

export {
  getAllStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  getRandomFunFact,
  postFunFacts,
  patchFunFact,
  deleteFunFact,
};

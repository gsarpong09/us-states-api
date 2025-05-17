// controllers/statesController.js (CommonJS)
const fs = require('fs');
const path = require('path');
const State = require('../models/States');

const statesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/statesData.json'))
);

function normalizeState(raw) {
  return {
    state: raw.state,
    code: raw.code,
    capital: raw.capital_city,
    nickname: raw.nickname,
    population: raw.population.toLocaleString('en-US'),
    admitted: raw.admission_date
  };
}

const getAllStates = async (req, res) => {
  let merged = statesData.map(normalizeState);
  const dbStates = await State.find();

  merged = merged.map(state => {
    const match = dbStates.find(db => db.stateCode === state.code);
    if (match?.funfacts?.length) {
      return { ...state, funfacts: match.funfacts };
    }
    return state;
  });

  if (req.query.contig === 'true') {
    merged = merged.filter(st => !['AK', 'HI'].includes(st.code));
  } else if (req.query.contig === 'false') {
    merged = merged.filter(st => ['AK', 'HI'].includes(st.code));
  }

  res.json(merged);
};

const getState = async (req, res) => {
  const raw = statesData.find(s => s.code === req.code);
  if (!raw) return res.status(404).json({ message: 'State not found' });

  const state = normalizeState(raw);
  const db = await State.findOne({ stateCode: req.code });

  if (db?.funfacts?.length) {
    state.funfacts = db.funfacts;
  }

  res.json(state);
};

const getCapital = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({
    state: state.state,
    population: state.population.toLocaleString('en-US')
  });
};

const getAdmission = (req, res) => {
  const state = statesData.find(s => s.code === req.code);
  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, admitted: state.admission_date });
};

const getRandomFunFact = async (req, res) => {
  const info = statesData.find(s => s.code === req.code);
  if (!info) return res.status(404).json({ message: 'State not found' });

  const dbState = await State.findOne({ stateCode: req.code });
  if (!dbState?.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${info.state}` });
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

  const db = await State.findOne({ stateCode: req.code });
  if (!db?.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${req.code}` });
  }

  if (index < 1 || index > db.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${req.code}` });
  }

  db.funfacts[index - 1] = funfact;
  await db.save();
  res.json(db);
};

const deleteFunFact = async (req, res) => {
  const { index } = req.body;
  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });

  const db = await State.findOne({ stateCode: req.code });
  if (!db?.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${req.code}` });
  }

  if (index < 1 || index > db.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${req.code}` });
  }

  db.funfacts.splice(index - 1, 1);
  await db.save();
  res.json(db);
};

module.exports = {
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
};
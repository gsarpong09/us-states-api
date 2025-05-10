import fs from 'fs';

const statesData = JSON.parse(
  fs.readFileSync(new URL('../data/statesData.json', import.meta.url))
);

const stateCodes = statesData.map(state => state.code);

export const verifyState = (req, res, next) => {
  const code = req.params.state.toUpperCase();
  if (!stateCodes.includes(code)) {
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }
  req.code = code;
  next();
};

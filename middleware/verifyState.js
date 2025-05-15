import fs from 'fs';

const statesData = JSON.parse(
  fs.readFileSync(new URL('../data/statesData.json', import.meta.url))
);

const validCodes = statesData.map(state => state.code.toUpperCase());

export const verifyState = (req, res, next) => {
  const input = req.params.state?.toUpperCase();

  if (!validCodes.includes(input)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  req.code = input; // normalized 2-letter uppercase
  next();
};

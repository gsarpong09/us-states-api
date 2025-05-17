// middleware/verifyState.js (CommonJS)
const fs = require('fs');
const path = require('path');

const statesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/statesData.json'))
);

const stateCodes = statesData.map(state => state.code.toUpperCase());

const verifyState = (req, res, next) => {
  const code = req.params.state?.toUpperCase();

  if (!stateCodes.includes(code)) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  req.code = code; // Store normalized code
  next();
};

module.exports = verifyState;
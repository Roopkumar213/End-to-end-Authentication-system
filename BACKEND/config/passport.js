// backend/config/passport.js
require('dotenv').config();
const passport = require('passport');
const fs = require('fs');
const path = require('path');

function tryRequireStrategy(relPath) {
  try {
    const p = path.join(__dirname, '..', relPath);
    if (fs.existsSync(p)) {
      require(p);
      console.log(`Passport: loaded strategy from ${p}`);
      return true;
    } else {
      // try adding .js
      if (fs.existsSync(p + '.js')) {
        require(p + '.js');
        console.log(`Passport: loaded strategy from ${p}.js`);
        return true;
      }
    }
  } catch (err) {
    console.warn(`Passport: error requiring ${relPath}:`, err && err.message);
  }
  return false;
}

// Try the paths we know you might have
const tried = [
  'src/passport/google',          // backend/src/passport/google.js
  'src/config/passport',          // alternate
  'passport/google',              // backend/passport/google.js
  'config/passport-google',       // any custom name
];

let found = false;
for (const p of tried) {
  if (tryRequireStrategy(p)) { found = true; break; }
}

if (!found) {
  // final attempt: try to require ../src/passport/google.js directly and report a clear message
  try {
    const direct = path.join(__dirname, '..', 'src', 'passport', 'google.js');
    if (fs.existsSync(direct)) {
      require(direct);
      found = true;
      console.log(`Passport: loaded strategy from ${direct}`);
    }
  } catch (err) {
    // ignore
  }
}

if (!found) {
  console.warn('Passport: Google strategy file not found. Expected at backend/src/passport/google.js or similar.');
  console.warn('Passport: Please ensure your Google strategy file exists and calls passport.use(...)');
}

// export the single passport instance
module.exports = passport;

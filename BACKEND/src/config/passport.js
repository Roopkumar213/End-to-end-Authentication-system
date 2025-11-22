// passport.js
// Configures Passport strategies for Google and GitHub OAuth.
// Exports the configured passport instance.
// Usage: const passport = require('./config/passport'); app.use(passport.initialize());

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Make sure the User model path matches your project structure.
// The user model is expected to expose standard mongoose model methods.
const User = require('../models/User');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK = process.env.GOOGLE_REDIRECT_URI; // e.g. http://localhost:4000/api/auth/google/callback

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK = process.env.GITHUB_REDIRECT_URI; // e.g. http://localhost:4000/api/auth/github/callback

// Helper: unify profile data and create/find a user
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatar }) {
  // Expect User schema to include: provider, providerId, email, name, avatar
  // Additional fields like passwordHash should be absent for OAuth users.
  let user = await User.findOne({ provider, providerId });

  if (!user && email) {
    // try to match by email (in case user signed up earlier with email/password)
    user = await User.findOne({ email });
  }

  if (user) {
    // If providerId not set (user previously signed up with email), update provider info
    if (!user.provider || user.provider !== provider) {
      user.provider = provider;
      user.providerId = providerId;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
    return user;
  }

  // Create new user
  const newUser = new User({
    name: name || 'No Name',
    email: email || undefined,
    provider,
    providerId,
    avatar,
    // No passwordHash for OAuth users
  });

  await newUser.save();
  return newUser;
}

// Configure Google Strategy if credentials provided
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK) {
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = profile.id;
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const name = profile.displayName || (profile.name && `${profile.name.givenName || ''} ${profile.name.familyName || ''}`).trim();
        const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;

        const user = await findOrCreateOAuthUser({
          provider: 'google',
          providerId,
          email,
          name,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.warn('Google OAuth not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI to enable it.');
}

// Configure GitHub Strategy if credentials provided
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_CALLBACK) {
  passport.use(new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const providerId = profile.id;
        // GitHub may return multiple emails; find the primary verified one
        let email;
        if (profile.emails && profile.emails.length) {
          const primary = profile.emails.find(e => e.primary) || profile.emails[0];
          email = primary && primary.value;
        }
        const name = profile.displayName || profile.username;
        const avatar = profile._json && profile._json.avatar_url;

        const user = await findOrCreateOAuthUser({
          provider: 'github',
          providerId,
          email,
          name,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.warn('GitHub OAuth not configured. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_REDIRECT_URI to enable it.');
}

// Passport serialize/deserialize - useful if you later decide to use sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

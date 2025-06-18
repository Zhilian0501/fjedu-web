import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import  db  from './db.js';

passport.use(new GoogleStrategy({
  clientID: '你的CLIENT_ID',
  clientSecret: '你的CLIENT_SECRET',
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;

  try {
    const [rows] = await db.query(`
      SELECT u.* FROM users u
      JOIN user_providers up ON u.id = up.user_id
      WHERE up.provider = 'google' AND up.provider_user_id = ?
    `, [googleId]);

    if (rows.length > 0) return done(null, rows[0]);

    // 不存在就創新用戶並綁定
    const [result] = await db.query(
      `INSERT INTO users (username, email) VALUES (?, ?)`,
      [profile.displayName, email]
    );
    const userId = result.insertId;

    await db.query(
      `INSERT INTO user_providers (user_id, provider, provider_user_id) VALUES (?, 'google', ?)`,
      [userId, googleId]
    );

    done(null, { id: userId, username: profile.displayName });
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  done(null, rows[0]);
});

export default passport;

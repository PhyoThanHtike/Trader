import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./database.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id }
        });

        if (!user) {
          // Check if user already exists by email (linked with email signup)
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
          });

          if (existingUser) {
            // Link Google ID to existing user
            const updatedUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: profile.id,
                profilePicture: profile.photos[0].value,
              }
            });
            return done(null, updatedUser);
          }

          // Create new user
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              password: "google-auth", // Set a dummy password for Google users
            }
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
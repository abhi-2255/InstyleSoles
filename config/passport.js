const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/userModel')

console.log(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_SECRET);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            if (!profile.emails || !profile.emails.length) {
                throw new Error('No email found in profile');
            }
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });
            // console.log('user=',user);
            if (!user) {
                console.log('entry');
                user = new User({
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.emails[0].value,
                    password:profile.sub,
                    isVerified: true
                });
                const userData = await user.save()
                console.log('userData' ,userData)
            }
            
            done(null, user);
        } catch (error) {
            return done(error, false)
        }
    }
))
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (id, done) => { 
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});
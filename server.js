const express = require('express')
const app = express()
const session = require('express-session');
require('dotenv').config();
const path = require('path')
const nocache = require('nocache')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const connectMongoose = require('./config/mongooseConfig')

const passport = require('passport');

const PORT = 3000

connectMongoose()
require('./config/passport')


app.use('/public',express.static(path.join(__dirname,'/public')))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(nocache())


app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: true,
    saveUninitialized: true,
  }))

  app.use(passport.initialize());
  app.use(passport.session())


app.use('/admin', adminRoute)
app.use('/', userRoute)







// app.use(function(req, res, next){
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use((error,req, res,next) => {
//   console.log(error)
//   console.log(error.message)
//   res.status(error.status || 500);
//   res.render("404page");
// });






app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
    console.log(`http://localhost:${PORT}/signup`);
})





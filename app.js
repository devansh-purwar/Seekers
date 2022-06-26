if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Room = require('./models/room');
const User = require('./models/user');
const UserProfile = require('./models/userProfile');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const userProfileRoutes = require('./routes/userProfile');
const MongoDBStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/seekers';
const catchAsync = require('./utils/catchAsync');

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/rooms', roomRoutes)
app.use('/userProfiles', userProfileRoutes)

app.get('/', catchAsync( async (req, res) => {
    const rooms = await Room.find({}).populate('authorProfile');
    const profiles = await UserProfile.find({ 'profilePrivacy' : { $ne : 'Hidden'}});

    console.log("------------------------- Rooms -----------------------",rooms)
    console.log("---------------------- Profiles ---------------------",profiles)
    res.render('home', { rooms : rooms.slice(0,4), profiles:profiles.slice(0,4) })
}));
// app.get('/verify', (req, res) => {
//     const query = req.query;
//     User.findById(query.user, (err, user) => {
//         if (err) {
//             console.log(err)
//         } else {
//             if (user.verifyToken === query.token) {
//                 user.isVerified = true;
//                 user.save((err) => {
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("User verified!", user)
//                         req.flash('success', 'Your account has been verified! , You can create your profile now.')
//                         res.redirect('/userProfiles/new')
//                     }
//                 })
//             } else {
//                 console.log("User verification failed!", user)
//                 req.flash('error', 'Invalid token')
//                 res.redirect('/')
//             }
//         }
//     })
// })


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
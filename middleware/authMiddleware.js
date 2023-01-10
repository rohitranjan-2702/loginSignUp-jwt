const jwt = require('jsonwebtoken');
const tutor = require('../models/tutor')

// protecting our routes
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jsonwebtoken exists & is verified
    if (token) {
        jwt.verify(token, 'maja nahi arha hai', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'maja nahi arha hai', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
            } else {
                console.log(decodedToken);
                let user = await tutor.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
   
}

module.exports = { requireAuth, checkUser };
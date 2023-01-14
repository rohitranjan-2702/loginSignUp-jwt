const Tutor = require('../models/tutor');
const Learner = require('../models/learner');
const jwt = require("jsonwebtoken")

// handle errors
const handleErrors = (err) => {
    console.error(err.message, err.code);
    let errors = { email: '', password: '', techstack:'' };

// incorrect email 
if(err.message === 'incorrect email'){
    errors.email = "that email is not registered";
}
// incorrect password 
if(err.message === 'incorrect password'){
    errors.password = "that password is incorrect";
}

// duplicate error code
if(err.code === 11000){
    errors.email = 'this email is already registered'
    return errors;
}

// validate errors
if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
}

const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id}, 'maja nahi arha hai', {
        expiresIn: maxAge
    });
}

module.exports.tutor_signup_get = (req, res) => {
    res.render('tutorSignup');
}
module.exports.learner_signup_get = (req, res) => {
    res.render('learnerSignup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

// tutor
module.exports.tutor_signup_post = async (req, res) => {
   const { email, password, techstack, about } = req.body;

   try {
      const tutor = await Tutor.create({
        email, password, techstack, about });
      const token = createToken(tutor._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
      res.status(201).json({tutor: tutor._id});  
   } 
   catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors})
   }
   res.redirect('/');
}

// Learner
module.exports.learner_signup_post = async (req, res) => {
   const { email, password } = req.body;

   try {
      const learner = await Learner.create({
        email, password });
      res.status(201).json(learner);  
   } 
   catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors})
   }
}

module.exports.tutor_login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try{
        const user = await Tutor.login(email, password);
        const token = createToken(tutor._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000 });
        res.status(201).json({tutor: tutor._id});  
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    // replacing the token with empty string with 1ms expire tie
    res.redirect('/');
}

module.exports.tutor_profile_get = async (req, res) => {
    try{
        const tutor = await Tutor.find();
        res.status(200).send(tutor);
    } catch(err){
        res.status(400).send(err.message);
    }
}
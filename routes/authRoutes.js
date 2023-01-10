const { Router} = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/learnerSignup', authController.learner_signup_get);
router.post('/learnerSignup', authController.learner_signup_post);

router.get('/tutorSignup', authController.tutor_signup_get);
router.post('/tutorSignup', authController.tutor_signup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.tutor_login_post);

router.post('/logout', authController.logout_get);

module.exports = router;
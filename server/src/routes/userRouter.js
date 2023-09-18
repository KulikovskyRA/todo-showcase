const express = require('express');

const { body } = require('express-validator');
// const authMiddleware = require('../middlewares/authMiddleware');

const {
  registration,
  login,
  logout,
  activationLink,
  refresh,
  getUsers,
} = require('../controllers/userController');

const router = express.Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  registration
);
router.post('/login', login);
router.post('/logout', logout);
router.get('/activate/:link', activationLink);
router.get('/refresh', refresh);
router.get(
  '/',
  // authMiddleware,
  getUsers
);

module.exports = router;

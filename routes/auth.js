const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
  //validate data before add user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check email arleardy used/register
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send('Email already registered')

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    const savedUser = await user.save();
    //send respond only the id after saved
    res.send({ user: user._id });

  } catch (err) {
    res.send(err)
  }
})

//login
router.post('/login', async (req, res) => {
  //validate data before login
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check email arleardy used/registered
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Email not found')

  //check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('invalid password')

  //create&asign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token)

  // res.send('Logged in!');

})

module.exports = router;
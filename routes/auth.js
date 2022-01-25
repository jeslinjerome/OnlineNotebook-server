const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodboy';

//create a User using: POST "/api/auth/createuser". Doesnt require Auth.
router.post("/createuser",[
    body('name', 'Enter a valid name').isLength({ min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5})
] , async (req, res) => {
// If there are errors, return Bad request and the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
  }
// Check whether the user with this email exits already
try {
    let user = await User.findOne({email: req.body.email});
if (user) {
    return res.status(400).json({error: "Sorry a User with this email is already exists"})
}
//password hashing with salt
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password, salt);

// Create a new user
  user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
  });
  const data = {
      user:{
          id: user.id
      }
  }
  // it will give the jwt data
  const authtoken = jwt.sign(data, JWT_SECRET);

//   res.json(user)
res.json({authtoken})

} catch (error) {
    //idealy we put in logger or sos
    console.error(error.message);
    res.status(500).send("Some error occured");
}
});
 
module.exports = router;

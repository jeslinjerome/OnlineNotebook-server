const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Harryisagoodboy";

//ROUTE 1: create a User using: POST "/api/auth/createuser". Doesnt require Auth.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exits already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a User with this email is already exists" });
      }
      //password hashing with salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      // it will give the jwt data
      const authtoken = jwt.sign(data, JWT_SECRET);

      //   res.json(user)
      res.json({ authtoken });
    } catch (error) {
      //idealy we put in logger or sos
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);


//ROUTE 2: Authenticate a user using: POST "api/auth/login". No login Required.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //pull user from the database
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please ter to login with correct credentials" });
      }
      // if password is correct send payload(data) - data of the user that i send
      const data = {
        user: {
          id: user.id,
        },
      };
      // it will give the jwt data
      const authtoken = jwt.sign(data, JWT_SECRET);

      //   res.json(user)
      res.json({ authtoken });
    } catch (error) {
      //idealy we put in logger or sos
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


//ROUTE 3: Get loggedin User details using: POST "api/auth/getuser". login Required.
//middleware is required to get user through authtoken
//append the authtoken in the ..Get User Data Request.. in header section
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        let userId = req.user.id; //
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;
 
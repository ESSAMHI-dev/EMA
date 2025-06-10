const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/Authmiddleware");
const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// Access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Registration logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists." });

    user = new User({ name, email, password });
    await user.save();

    // Create jwt Payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user Data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // Send the user and token in response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @accesss public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Find hte user by email
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "invalid credentials." });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // Create jwt Payload
    const payload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user Data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // Send the user and token in response
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// @route GET /api/users/profile
// @desc GET logged-in user's profile  (Protected route)
// @access Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;

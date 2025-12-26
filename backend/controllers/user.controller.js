const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //check if email exists
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(422).json({ errors: [{ msg: "Email already exists", param: "email" }] });
    }
    //salting
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Failed to generate salt!");

    //salt password from req.body
    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Failed to hash the password!");

    //usertemplate
    const newUser = new User({
      name,
      email,
      password: hash,
    });

    //save user
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Error saving user");

    //user saved successfully
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

exports.login = async (req, res) => {
  //fields required in the login form
  const { name, email, password } = req.body;

  try {
    //find if email exists
    const user = await User.findOne({
      email,
    });
    //users mail is not existing
    if (!user) throw Error("User with this e-mail does not exist");
    //wrong password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Password is not correct");

    const userTemplate = {
      id: user.id,
      name: user.name,
      email,
      message: "Auth Succesful",
    };

    const token = createToken(user._id);

    if (!token) throw Error("Token not found");

    res.status(200).json({
      token,
      ...userTemplate,
    });
    
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

exports.protected = async (req, res) => {};


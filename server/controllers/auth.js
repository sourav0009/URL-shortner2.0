const {
  createAndSendToken,
  verifyToken,
  transporter,
  isPasswordComplex,
} = require("../middlewares/auth");
const { URL, UserModel } = require("../models/url");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
dotenv.config({ path: "../.env" });

const secretKey = process.env.JWT_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const username = user.username;
    const avatar = user.avatar;
    const newUser = new UserModel({
      username,
      email,
      password: user.password,
      avatar,
    });
    createAndSendToken(newUser, 202, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}
async function register(req, res) {
  const { username, email, password } = req.body;
  let avatar = null;
  console.log(username, email, password);
  try {
    if (!isPasswordComplex(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter, one numeric digit, and one special character",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      if (req.file && req.file.path) {
        // Upload image to cloudinary

        const result = await cloudinary.uploader.upload(req.file.path);
        avatar = result.url; // Set avatarUrl to the uploaded image URL
      }
    } catch {
      throw new Error("No profile picture found, setup failed.");
    }
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    await newUser.save();
    createAndSendToken(newUser, 201, res);
  } catch (error) {
    console.log("Failed to save:", error);
    return res
      .status(500)
      .json({ message: "Failed to save user", error: error });
  }
}
async function welcome(req, res) {
  res.status(200).json("welcome");
}

async function decodeJWT(req, res) {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const username = decoded.username;
    const profileURL = decoded.avatar;
    res
      .status(201)
      .json({ email: email, username: username, profileURL: profileURL });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function generateOtp(req, res) {
  const email = req.body;
  let newotp = "";
  for (let i = 0; i <= 3; i++) {
    newotp += Math.floor(Math.random() * 10).toString();
  }
  try {
    const user = await UserModel.findOneAndUpdate(
      email,
      { $set: { otp: newotp } },
      { new: true }
    );
    const mailOptions = {
      from: "bikikutta25@gmail.com",
      to: email.email,
      subject: "OTP-Verification",
      text: `Please use the code below to confirm your email address. This code will expire in 2 hours. If you don't think you should be receiving this email, you can safely ignore it. 
        ${newotp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    if (user) {
      res.status(200).send({ message: "Otp Success" });
    } else {
      res.status(404).send({ message: "No existing admin found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "OTP generation failed" });
  }
}

async function otpValidation(req, res) {
  const { email, otp } = req.body;
  console.log(email);
  console.log(otp);
  try {
    const user = await UserModel.findOne({ email: email, otp: otp });
    if (user) {
      console.log("Validation Success");
      res.status(202).json({ success: true });
    } else {
      console.log("Validation Failed");
      res.status(401).json("Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .send({ message: "OTP validation failed, Internal server error" });
  }
}

async function resetPassword(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.findOneAndUpdate(
    { email: email },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  if (user) {
    res.status(201).send({ message: "Password reseted" });
  } else {
    res.status(502).send("password reset process failed");
  }
}
async function handleuservalidation(req, res) {
  const { email, name } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // User with this email already exists
      res.status(200).send({ message: "User already exists" });
    } else {
      // User does not exist, save the new user
      const newUser = new UserModel({ email: email, name: name });
      await newUser.save();
      res.status(201).send({ message: "User saved successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

module.exports = {
  login,
  welcome,
  decodeJWT,
  generateOtp,
  otpValidation,
  register,
  resetPassword,
  handleuservalidation,
};

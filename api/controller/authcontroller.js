const User = require("../models/user");
var bcrypt = require("bcryptjs");
const config = require("../config/key");
var jwt = require("jsonwebtoken");
const axios = require("axios");

const CLIENT_ID = "Ov23lieqe9tnNqMecUxI";
const CLIENT_SECRET = "9d4e71dc1eeb6c9819672f71a3dc1769d958fe95";
const GITHUB_URL = "https://github.com/login/oauth/access_token";

exports.oauth2Redirect = async (req, res) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
      headers: {
        Accept: "application/json",
      },
    });
    const userData = await axios({
      method: "GET",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + response.data.access_token,
      },
    });
    console.log(userData);
    const { login, name } = userData.data;
    let user = await User.findOne({ login }).select("-password");
    if (!user) {
       user = new User({
        username: login,
        name: name,
      });
      try {
        await user.save();
      } catch (err) {
        console.log(err);
        res.status(500).send("Error while creating the account");
      }
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.secret,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );
    
    res.redirect(
      `http://localhost:8080/todo.html?access_token=${token}`
    );
  } catch (error) {
    console.error("Error during GitHub authentication:", error);
    res.status(500).send("Error during GitHub authentication");
  }
};
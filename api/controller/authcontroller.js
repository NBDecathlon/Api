const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config/key");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_URL = "https://github.com/login/oauth/access_token";

exports.oauth2Redirect = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Authorization code is required.");
    }

    const tokenResponse = await axios.post(GITHUB_URL, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      headers: { Accept: "application/json" },
    });

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.status(401).send("Failed to retrieve access token.");
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}` },
    });

    const { login, name } = userResponse.data;
    let user = await User.findOne({ login }).select("-password");
    if (!user) {
      user = new User({ username: login, name });
      await user.save();
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.secret,
      { algorithm: "HS256", expiresIn: 86400 }
    );

    res.redirect(`http://localhost:8080/todo.html?access_token=${token}`);
  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    res.status(500).send("An error occurred during GitHub authentication.");
  }
};
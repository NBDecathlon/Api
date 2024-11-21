const User = require("../models/user");
var bcrypt = require("bcryptjs");
const config = require("../config/key");
var jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    const user = new User({
      username: req.body.username,
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || 'User',
    });
    try {
      await user.save();
      res.send({ message: "Utilisateur enregistré avec succès !" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la création du compte");
    }
};

exports.signin = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé !" });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Mot de passe invalide !",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      }
    );

    res.status(200).send({
      id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
      accessToken: token,
    });
};
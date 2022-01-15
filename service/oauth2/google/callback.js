const jwt = require("jsonwebtoken");
const axios = require("axios");
const user_service = require("../../../service/user");

_this = module.exports = {

  /** fetches id and access-token from authorization code sent by google.
   *
   */
  googleOAuthHandler: async function (req, res) {
    try {
      const code = req.query.code.toString();
      const { id_token, access_token } = await user_service.getGoogleOAuthToken(code);
      console.log(`id_token : ${id_token} \n acces_token : ${access_token}`);

      const { data: googleUser } = await user_service.getGoogleUser({
        id_token,
        access_token,
      });

      console.log(jwt.decode(id_token));
      console.log(googleUser);
      if (!googleUser.verified_email) {
        return res.status(403).send("Google account email is not verified");
      }


      const result = await axios.put(`http://localhost:8080/api/user/${googleUser.email}`, { username : googleUser.name , email : googleUser.email});
      return res.send(result.data);
      // return res.status(200).send("User created");
     
    } catch (err) {
      console.log(err);
      return res.redirect(
        `http://localhost:${process.env.PORT || 8080}/auth/error`
      );
    }
  },
};

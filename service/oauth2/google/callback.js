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
      const { id_token, access_token } = await user_service.getOAuthTokenFromCode(
        "https://oauth2.googleapis.com/token".toString(),
        code
      );
      console.log(`id_token : ${id_token} \n acces_token : ${access_token}`);

      const { data: googleUser } = await user_service.getUserFromOAuthTokens(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=",
        {
          id_token,
          access_token,
        }
      );

      if (!googleUser.verified_email) {
        return res.status(403).send("Google account email is not verified");
      }

      await axios.put(`http://localhost:8080/api/user/${googleUser.email}`, {
        username: googleUser.name,
        email: googleUser.email,
      });

      const result = await axios.get(
        `http://localhost:8080/api/user/${googleUser.email}`,
        {
          headers: {
            authorization: `Bearer ${id_token}`,
          },
        }
      );
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

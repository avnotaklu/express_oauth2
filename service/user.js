const axios = require("axios");
const qs = require("qs");
const routes = require("../routes/routes")
const { PromiseProvider } = require("mongoose");
const models = require("../models/user");

const _this = module.exports  = {
  
  /**
   * sends a post request with code to get tokens
   * @param { the code sent by google after logging in consent screen} code 
   */
  getGoogleOAuthToken: async function (code) {
    const url = "https://oauth2.googleapis.com/token".toString();
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
      grant_type: "authorization_code",
    };
    try {
      const res = await axios.post(url, qs.stringify(values), {
        Headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      throw new err;
    }
  },

  /**
   * sends a get request with id_token and access_token to get user
   * @param { id_token retrieved from google } id_token 
   * @param { access_token retrieved from google } acces_token 
   */
  getGoogleUser: async function ({ id_token, access_token }) {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          Headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw new err();
    }
  },

}

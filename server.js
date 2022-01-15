const express = require("express");
const mongoose = require("mongoose");
const google_auth = require("./service/oauth2/google/consent_screen");
const google_callback = require("./service/oauth2/google/callback");
const port = process.env.PORT || 8080;

require("dotenv").config();
const app = express();

//Using middlewares
app.use(...require("./middlewares"));

//connecting to mongoDb
mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost:27017/test", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    //Middleware routes for /api path
    const apiRoutes = require("./routes/routes");
    app.use("/api", apiRoutes);
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Error...", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({
    message: "Server is up and running",
  });
});


// callback that google redirects to after user login
// sessions break restfulness, this will probably change
app.get("/api/sessions/oauth/google", google_callback.googleOAuthHandler);

// Login screen takes straight to google consent screen
app.get("/login", (req, res) => {
  return res.redirect(google_auth.getGoogleConsentScreenUrl());
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

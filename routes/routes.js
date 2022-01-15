const { User } = require("../models/user");
const router = require("express").Router();


// Get all users in Db collection with pagination implemention

router.get("/user", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  User.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .then((allUsers) => {
      res.json(allUsers);
    })
    .catch((err) => res.status(400).json("Error!"+err));
});

// Post a new user to db
router.post("/user/signup", (req, res) => {
  const user = new User(req.body);
    user
    .save()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error! " + err));
});

// Delete a user from db via its id
router.delete("/user/:id", (req, res) => {
  User.findOneAndRemove({
    _id: req.params.id,
  })
    .then((success) => {
      if (success) {
        return res.json("Success! User deleted.");
      } else {
        return res.json("Failure! User not found");
      }
    })

    .catch((err) => res.status(400).json("Error! " + err));
});

// Edit a user detail
router.put("/user/:email", (req, res) => {
  User.findOneAndUpdate(
    { email : req.params.email},
    { email: req.body.email , username: req.body.username},
    { upsert: true, new: true }
  )
    .then((success) => {
      if (success) {
        return res.status(200).json("Success! User updated. " + success.username);
      } else {
        return res.status(404).json("Failure! User not found");
      }
    })
    .catch((err) => res.status(400).json("Error! " + err));
});

// Export API routes
module.exports  = router;

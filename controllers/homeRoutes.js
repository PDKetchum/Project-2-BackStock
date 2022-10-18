const sequelize = require("../config/connection");
const { Location, Product, User, Shelf } = require("../models");
const withAuth = require("../utils/auth");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("landingpage");
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect("/homepage");
    return;
  }
  res.render("login");
});

router.get("/locations", withAuth, async (req, res) => {
  const locationData = await Location.findAll({ raw: true });
  res.render("locations", { locations: locationData });
});



router.get("/homepage", withAuth, async (req, res) => {
  const UserData =await User.findOne({raw: true});
  res.render("homepage", {User: UserData});
});
 
router.get("/backstock/:id", withAuth, async (req, res) => {
  try {
    const driverData = await Location.findByPk(req.params.id, {
      where: {
        location_id: req.params.id,
      },
      include: [{model: Product, attributes: ['name', 'quantity']}, User],
    });
 

    const shelf=driverData.get({plain: true}); 
    if (!driverData) {
      res.status(404).json({ message: "No table found with that ID!" });
      return;
    }
    // res.status(200).json(shelf);
    res.render("backstock", {Products: shelf});
  } catch (err) {
    res.status(500).json(err);
  }
  
});

module.exports = router;

~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const assessmentlist = require ("./controllers/assessmentlist");
const trainerDashboard = require("./controllers/trainerDashboard.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/trainerLogin", accounts.trainerLogin);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
router.post("/trainerAuthenticate", accounts.trainerAuthenticate);

router.get("/settings", accounts.currentUserUpdate);

router.post("/updateCurrentUser", accounts.updateCurrentUser);
router.get("/dashboard/deleteAssessment/:id",dashboard.deleteAssessment);
router.get("/dashboard", dashboard.index);
router.get("/trainerDashboard", trainerDashboard.index);

router.post("/dashboard/addAssessment", dashboard.addassessment);

router.get("/about", about.index);


module.exports = router;

"use strict";

const userstore = require("../models/user-store");
const trainerstore= require("../models/trainer-store");
const logger = require("../utils/logger");
const uuid = require("uuid");
//todo add a login for the trainer on drop down if possible
const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },
  trainerLogin(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("trainerLogin", viewData);
  },

  logout(request, response) {
    response.cookie("playlist", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },
  updateCurrentUser(request,response){
    const user = request.body;
    const userEmail = request.cookies.playlist;
    const currentUser = userstore.getUserByEmail(userEmail);
    currentUser.email=user.email;
    currentUser.firstName=user.firstName;
    currentUser.lastName=user.lastName;
    currentUser.height=user.height;
    currentUser.initialweight=user.initialweight;
    currentUser.gender=user.gender;
    currentUser.address=user.address;
    currentUser.password=user.password;
    userstore.updateUser(user);
    response.cookie("playlist", user.email);
    //logger.info(`updating the user ${user.email}`);
    response.redirect("/dashboard");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("playlist", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },
  trainerAuthenticate(request, response) {
    const trainer = trainerstore.getUserByEmail(request.body.email);
    if (trainer) {
      response.cookie("trainer", trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect("/trainerDashboard");
    } else {
      logger.info(`cannot login ${trainer.email}`);
      response.redirect("/trainerLogin");
    }
  },
  currentUserUpdate(request,response){
    const userEmail = request.cookies.playlist;
    const user = userstore.getUserByEmail(userEmail);
    const viewData = {
      loggedInUserFirstname: user.firstName,
      loggedInUserLastname: user.lastName,
      loggedInUserEmail:user.email,
      loggedInUserpassword:user.password,
      loggedInUseraddress:user.address,
      loggedInUserheight:user.height,
      loggedInUserInitialWeight:user.initialweight,
      loggedInUserGender:user.gender
    };

    response.render("currentUser",viewData)
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userstore.getUserByEmail(userEmail);

  }
};

module.exports = accounts;

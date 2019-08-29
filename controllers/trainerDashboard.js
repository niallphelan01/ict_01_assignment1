"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentlistStore = require("../models/gym-store.js");
const userStore = require("../models/user-store.js");
const trainerStore= require("../models/trainer-store.js");
const uuid = require("uuid");

const trainerDashboard = {
    index(request, response) {
        //get the trainer logged in
        var loggedInTrainer = accounts.getCurrentTrainer(request);



        const viewData = {
            title: "Trainer Assessment Dashboard",
            loggedInTrainerFirstname: loggedInTrainer.firstName,
            loggedInTrainerLastname: loggedInTrainer.lastName,
            userlist: userStore.getAllUsers()
        };
        response.render("trainerDashboard", viewData);
    }
    };

module.exports = trainerDashboard;
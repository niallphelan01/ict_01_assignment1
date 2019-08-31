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
    },
    assessments(request,response){


        const userId = request.params.id;

        //Get the current user by the ID selected
        var user = userStore.getUserById(userId);

            const viewData = {
                //return the assessmentList for the users
                assessmentList: assessmentlistStore.getUserAssessmentlists(userId),
                //return the lastName and FirstName from the user
                firstName: user.firstName,
                lastName: user.lastName
            };
            response.render("assessmentlist", viewData);
        }
    };


module.exports = trainerDashboard;
"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentlistStore = require("../models/gym-store.js");
const userStore = require("../models/user-store.js");
const trainerStore= require("../models/trainer-store.js");

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
        var userId = request.params.id;

        //Get the current user by the ID selected
        var user = userStore.getUserById(userId);

        var assessmentlists = assessmentlistStore.getUserAssessmentlists(userId)
        //sort the list by dates in chronological order
        //reference https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
        //http://www.javascriptkit.com/javatutors/arraysort2.shtml

        var sortedAssessmentlists = assessmentlists.sort(function(a,b){
            var dateA=new Date(a.sortingdate), dateB=new Date(b.sortingdate);
            return dateB-dateA; //sort by date ascending
        });
            const viewData = {
                //return the assessmentList for the users
                assessmentList: sortedAssessmentlists,
                //return the lastName and FirstName from the user
                firstName: user.firstName,
                lastName: user.lastName
            };
            response.render("assessmentlist", viewData);
        },

    editAssessment(request,response){
        const AssessmentId=request.params.id;
        var assessment = assessmentlistStore.getAssessmentlist(AssessmentId);

        response.cookie("AssessmentID", AssessmentId);
        const viewData = {
            comment: assessment.comment,
            date: assessment.date
        };
        response.render("editAssessment", viewData);
        },


    updateAssessment(request,response){
        const comment= request.body;
        const AssessmentID = request.cookies.AssessmentID;
        var assessment  = assessmentlistStore.getAssessmentlist(AssessmentID);
        assessment.comment = comment.comment;
        assessmentlistStore.updateAssessment(AssessmentID);
        response.cookie("AssessmentID", "");
        response.redirect("/trainerDashboard");

    }
    }



module.exports = trainerDashboard;
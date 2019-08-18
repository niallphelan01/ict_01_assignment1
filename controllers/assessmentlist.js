"use strict";

const logger = require("../utils/logger");
const assessmnentlistStore = require("../models/gym-store.js");
const uuid = require("uuid");

const assessmentlist = {
    index(request,response){
        const assessmentlistId=request.params.id;
        logger.debug("Assessment id = ", assessmentlistId);
        const viewData = {
            title: "Assessment",
            assessmentlist: assessmnentlistStore.getAssessmentlist(assessmentlistId)
        };
        response.render("assessmentlist", viewData);
    },

   addAssessment(request, response){
       const loggedInUser = accounts.getCurrentUser(request);
       logger.debug("the logged in user" + loggedInUser);
       const newAssessment = {
           id:uuid(),
           userid:loggedInUser.id,
           assessments: []
      //         id:uuid();
      //     date: request.body.date,
      //     weight: request.body.weight,
      //     chest: request.body.chest,
      //     thigh: request.body.thigh,
      //     upperarm: request.body.upperarm,
      //     waist: request.body.waist,
      //     hips: request.body.hips
       };
       logger.debug("Creating a new Assessment", newAssessment);
       assessmnentlistStore.addAssessment(newAssessment);
       response.redirect('/dashboard');

       // addPlaylist(request, response) {
       //   const loggedInUser = accounts.getCurrentUser(request);
       //   const newPlayList = {
       //     id: uuid(),
       //     userid: loggedInUser.id,
       //     title: request.body.title,
       //     songs: []
       //   };
       //   logger.debug("Creating a new Playlist", newPlayList);
       //   playlistStore.addPlaylist(newPlayList);
       //   response.redirect("/dashboard");
       // }
   }
};

module.exports = assessmentlist;

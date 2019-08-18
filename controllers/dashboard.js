"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentlistStore = require("../models/gym-store.js");
const userStore = require("../models/user-store.js");
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering!");
    var BMI =0 ;
    var BMICategory=0;
    var colour = "blue";
    const loggedInUser = accounts.getCurrentUser(request);
    var currentAssessment = assessmentlistStore.getCurrentAssessment(loggedInUser.id);
    //BMI calculation and allowance for no assessment
    if (currentAssessment==null)
    {
       BMI = parseFloat((loggedInUser.initialweight) / ((loggedInUser.height / 100) * (loggedInUser.height / 100))).toFixed(2);
    }
    else
    {
      BMI = parseFloat((currentAssessment.weight)/((loggedInUser.height / 100) * (loggedInUser.height / 100))).toFixed(2);
      //https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
    }

    ///////
    //BMI category calculation
    if (BMI <16)
      BMICategory="Severely Underweight";
    else if (BMI >=16 && BMI <18.5)
      BMICategory="Underweight";
    else if (BMI >=18.5 && BMI<25)
      BMICategory="Normal";
    else if (BMI >=25 && BMI<30)
      BMICategory="Overweight";
    else if (BMI >=30 && BMI<35)
      BMICategory="Moderately Obese";
    else if (BMI >35)
     BMICategory="Severely Obese";

    //BMI category

    //Ideal weight calculations
    //
    let heightDifference = 0;
    let overHeight = 152.4;
    let inch=2.54;
    let perInchIncrease =2.3;
    let weightForOverHeight; //assumeFemale
    let idealweight=0;
    let difference = 0;
    if (loggedInUser.gender==="male") {
      weightForOverHeight = 50;
    }
   else weightForOverHeight=45.5;

   if (loggedInUser.height>152.4)
     heightDifference = loggedInUser.height-152.4
    else
      heightDifference=0;

    idealweight=((heightDifference/inch)*perInchIncrease)+weightForOverHeight;
    if (currentAssessment==null) //i.e.  assessments
    {
      difference = Math.abs(idealweight - loggedInUser.initialweight);
      difference = parseInt(difference);
      if (idealweight<(loggedInUser.initialweight+2) && idealweight>(loggedInUser.initialweight-2))
        colour="green";
      else
        colour="red";

    }
    else
    {
      difference = Math.abs(idealweight - currentAssessment.weight);
      //if (idealweight<(loggedInUser.weight+2) && idealweight>(loggedInUser.weight-2))
      //difference = parseInt(difference);
        if (difference<2)
        colour="green";
      else
        colour="red";
    }

    const viewData = {
      title: "Assessment Dashboard",
      BMI: BMI,
      colour: colour,
      BMICategory: BMICategory,
      loggedInUserFirstname: loggedInUser.firstName,
      loggedInUserLastname: loggedInUser.lastName,
      assessmentlists: assessmentlistStore.getUserAssessmentlists(loggedInUser.id)
    };
    logger.info("about to render assessment lists", assessmentlistStore.getUserAssessmentlists(loggedInUser.id));
    response.render("dashboard", viewData);
  },

  addassessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("the logged in user" + loggedInUser);
    //get tge current date and give the correct order
    var date = new Date();
    var formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    const newAssessment = {
      id: uuid(),
      userid: loggedInUser.id,
      date: formatted_date,
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips,
      gender: request.body.gender,
    };
     logger.debug("Creating a new Assessment", newAssessment);
     assessmentlistStore.addAssessment(newAssessment);
     response.redirect('/dashboard');

  }
  /*
  Good level
   */
  //todo add the user accounts setting and change handling
  //todo add trainer accounts
  //todo add trainer accounts that can see a view of member assessments and add comment field

  /*
    Excellent level
    //todo members can delete individual assessments
    //todo members can set goals
    //todo members can delete any users
    //todo date/time for each assessment
    //todo goals for future date and measurement
    //todo Git repo with version history
   */
  /*
    Outstanding
    //todo show goal status promintely upon login
    //todo trainer can set goals for a member
    //todo assessment always listed in chronological order
    //todo goal status -open (future) -achieved -missed
    //todo goal summary (number achieved/missed)
    //todo git repo with version historu and tagged releases

   */

};
module.exports = dashboard;

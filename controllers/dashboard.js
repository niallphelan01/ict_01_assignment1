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
    var loggedInUser = accounts.getCurrentUser(request);
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
        else {
             difference = Math.abs(idealweight - currentAssessment.weight);
             if (difference < 2)
                 colour = "green";
             else
                 colour = "red";
         }

   var assessmentlists =  assessmentlistStore.getUserAssessmentlists(loggedInUser.id); //get the current list of assessments to order by
    //sort the list by dates in chronological order
    //reference https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      //http://www.javascriptkit.com/javatutors/arraysort2.shtml

      var sortedAssessmentlists = assessmentlists.sort(function(a,b){
          var dateA=new Date(a.sortingdate), dateB=new Date(b.sortingdate);
          return dateB-dateA; //sort by date ascending
      });

    const viewData = {
      title: "Assessment Dashboard",
      BMI: BMI,
      colour: colour,
      BMICategory: BMICategory,
      loggedInUserFirstname: loggedInUser.firstName,
      loggedInUserLastname: loggedInUser.lastName,
      assessmentlists: sortedAssessmentlists
    };
    logger.info("about to render assessment lists", assessmentlistStore.getUserAssessmentlists(loggedInUser.id));
    response.render("dashboard", viewData);
  },

  addassessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("the logged in user" + loggedInUser);
    //get tge current date and give the correct order
    var date = new Date();
    var formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() +":"+ date.getMinutes();

    //work out if the trend should be positive or negative
 var trend ="blue";
      var memberId= request.cookies.memberId;
      var assessmentlist = assessmentlistStore.getUserAssessmentlists(memberId);
      //if statement to compare new versus old weight for trending
       if (assessmentlistStore.getUserAssessmentlists(memberId).length > 0)  //check to see if there are older readings
       { //if there are initial measurements
           var compare1 = request.body.weight;
           var compare2 = assessmentlist[assessmentlist.length -1].weight;
                  }
       else {  //if no measurements have been made
           var compare2 =  userStore.getUserById(memberId).initialweight;
           var compare1 = request.body.weight;

       }
      var test = compare1<=compare2;
      if (test)
          trend = "green";
      else
          trend = "red";

    const newAssessment = {
      id: uuid(),
      userid: loggedInUser.id,
      date: formatted_date,
        sortingdate: date,
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips,
      gender: request.body.gender,
      comment: "none",
        trend: trend,
    };
     logger.debug("Creating a new Assessment", newAssessment);
     assessmentlistStore.addAssessment(newAssessment);
     response.redirect("/dashboard");

  },
    deleteAssessment(request,response){
      const assessmentId = request.params.id;
      logger.debug(`Deleting the assessment ${assessmentId}`);
      assessmentlistStore.removeAssessment(assessmentId);
      response.redirect("/dashboard");

    }
  /*
  Good level
   */


  /*
    Excellent level

    //todo members can set goals

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

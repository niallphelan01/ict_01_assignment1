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
    }
   };

module.exports = assessmentlist;

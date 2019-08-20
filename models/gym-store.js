"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const assessmentlistStore = {
    store: new JsonStore("./models/gym-store.json", {
        assessmentlistCollection: []
    }),
    collection: "assessmentlistCollection",

    getAllAssessmentlists() {
        return this.store.findAll(this.collection);
    },

    getAssessmentlist(id) {
        return this.store.findOneBy(this.collection, { id: id });
    },

    getUserAssessmentlists(userid) {
        return this.store.findBy(this.collection, { userid: userid });
    },

    getCurrentAssessment(userid){
        var assessmentArray = this.store.findBy(this.collection, { userid: userid });
        return assessmentArray[assessmentArray.length-1];
    },


   addAssessment(assessmentlist) {
        this.store.add(this.collection, assessmentlist);
        this.store.save();
    },
    removeAssessment(id) {
        const assessment = this.getAssessmentlist(id);
        this.store.remove(this.collection, assessment);
        this.store.save();
    },

};

module.exports = assessmentlistStore;

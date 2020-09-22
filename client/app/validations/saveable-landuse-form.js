import {
  validateFormat,
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpContactname: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedataadress: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpContactemail: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
    validateFormat({
      type: 'email',
      // Set allowBlank=true so that the validation message
      // only appears after user first types sometihng.
      // This field still indicates it is 'required'
      // through validatePresence within
      // submittable-landuse-form
      allowBlank: true,
      message: 'Must be a valid email address',
    }),
  ],
  dcpContactphone: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateFormat({
      type: 'phone',
      // Set allowBlank=true so that the validation message
      // only appears after user first types sometihng.
      // This field still indicates it is 'required'
      // through validatePresence within
      // submittable-landuse-form
      allowBlank: true,
      message: 'Please enter a 10 digit phone number',
    }),
  ],
  dcpCitycouncil: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedatacommunitydistrict: [
    validateLength({
      min: 0,
      max: 60,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedatazoningsectionnumbers: [
    validateLength({
      min: 0,
      max: 60,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedataexistingzoningdistrict: [
    validateLength({
      min: 0,
      max: 60,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSpecialdistricts: [
    validateLength({
      min: 0,
      max: 200,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpBoroughs: [
    validateLength({
      min: 0,
      max: 75,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCommunity: [
    validateLength({
      min: 0,
      max: 175,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedatapropertydescription: [
    validateLength({
      min: 0,
      max: 500,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpZonesspecialdistricts: [
    validateLength({
      min: 0,
      max: 300,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedatarenewalarea: [
    validateLength({
      min: 0,
      max: 60,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitedataidentifylandmark: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCeqrnumber: [
    validateLength({
      min: 0,
      max: 9,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpTextexistingfacility: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
  dcpHowlonghasexistingfacilitybeenatthislocat: [
    validateLength({
      min: 0,
      max: 2000,
    }),
  ],
  dcpCurrentfacilitylocation: [
    validateLength({
      min: 0,
      max: 50,
    }),
  ],
  dcpIndicatefiscalyears: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
  dcpIndicatepgno: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
  dcpWhatsite: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
  dcpCapitalbudgetline: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
  dcpForfiscalyrs: [
    validateLength({
      min: 0,
      max: 100,
    }),
  ],
};

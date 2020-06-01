import {
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpRevisedprojectname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpDescriptionofprojectareageography: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpUrbanareaname: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPleaseexplaintypeiienvreview: [
    validateLength({
      min: 0,
      max: 200,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectareaindutrialzonename: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectarealandmarkname: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpCityregisterfilenumber: [
    validateLength({
      min: 0,
      max: 25,
      message: 'Number is too long (max {max} characters)',
    }),
  ],

  dcpEstimatedcompletiondate: [
    validateLength({
      min: 0,
      max: 4,
      message: 'Please enter a valid year in YYYY format',
    }),
  ],

  dcpProjectdescriptionproposeddevelopment: [
    validateLength({
      min: 0,
      max: 3000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectdescriptionbackground: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectdescriptionproposedactions: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectdescriptionproposedarea: [
    validateLength({
      min: 0,
      max: 3000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectdescriptionsurroundingarea: [
    validateLength({
      min: 0,
      max: 3000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProjectattachmentsotherinformation: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningauthorizationpursuantto: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningauthorizationtomodify: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningtomodify: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningpursuantto: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpExistingmapamend: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpProposedmapamend: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningspecialpermitpursuantto: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningspecialpermittomodify: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpAffectedzrnumber: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpZoningresolutiontitle: [
    validateLength({
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPreviousulurpnumbers1: [
    validateLength({
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPreviousulurpnumbers2: [
    validateLength({
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPfzoningauthorization: [
    validateLength({
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPfzoningcertification: [
    validateLength({
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],

  dcpPfzoningspecialpermit: [
    validateLength({
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};

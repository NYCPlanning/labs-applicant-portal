import {
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpRevisedprojectname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Name must be between {min} and {max} characters',
    }),
  ],

  dcpDescriptionofprojectareageography: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Must be between {min} and {max} characters',
    }),
  ],

  dcpUrbanareaname: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Name is too long (max {max} characters)',
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
      message: 'Name is too long (max {max} characters)',
    }),
  ],

  dcpProjectarealandmarkname: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Name is too long (max {max} characters)',
    }),
  ],

  dcpCityregisterfilenumber: [
    validateLength({
      min: 0,
      max: 25,
      message: 'File Number is too long (max {max} characters)',
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
      message: 'Text is too long (max 3000 characters)',
    }),
  ],

  dcpProjectdescriptionsurroundingarea: [
    validateLength({
      min: 0,
      max: 3000,
      message: 'Text is too long (max 3000 characters)',
    }),
  ],

  dcpProjectattachmentsotherinformation: [
    validateLength({
      min: 0,
      max: 2000,
      message: 'Text is too long (max 2000 characters)',
    }),
  ],
};

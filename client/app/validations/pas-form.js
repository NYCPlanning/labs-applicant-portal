import {
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  dcpRevisedprojectname: [
    validateLength({
      max: 50,
      message: 'Name is too long (max 50 characters)',
    }),
  ],

  dcpDescriptionofprojectareageography: [
    validateLength({
      max: 2000,
      message: 'Description is too long (max 2000 characters)',
    }),
  ],

  dcpUrbanareaname: [
    validateLength({
      max: 250,
      message: 'Name is too long (max 250 characters)',
    }),
  ],

  dcpPleaseexplaintypeiienvreview: [
    validateLength({
      max: 200,
      message: 'Text is too long (max 200 characters)',
    }),
  ],

  dcpProjectareaindutrialzonename: [
    validateLength({
      max: 250,
      message: 'Name is too long (max 250 characters)',
    }),
  ],

  dcpProjectarealandmarkname: [
    validateLength({
      max: 250,
      message: 'Name is too long (max 250 characters)',
    }),
  ],

  dcpCityregisterfilenumber: [
    validateLength({
      max: 25,
      message: 'File Number is too long (max 25 characters)',
    }),
  ],

  dcpEstimatedcompletiondate: [
    validateLength({
      max: 4,
      message: 'Please enter a valid year in YYYY format',
    }),
  ],

  dcpProjectdescriptionproposeddevelopment: [
    validateLength({
      max: 3000,
      message: 'Text is too long (max 3000 characters)',
    }),
  ],

  dcpProjectdescriptionbackground: [
    validateLength({
      max: 2000,
      message: 'Text is too long (max 2000 characters)',
    }),
  ],

  dcpProjectdescriptionproposedactions: [
    validateLength({
      max: 2000,
      message: 'Text is too long (max 2000 characters)',
    }),
  ],

  dcpProjectdescriptionproposedarea: [
    validateLength({
      max: 3000,
      message: 'Text is too long (max 3000 characters)',
    }),
  ],

  dcpProjectdescriptionsurroundingarea: [
    validateLength({
      max: 3000,
      message: 'Text is too long (max 3000 characters)',
    }),
  ],

  dcpProjectattachmentsotherinformation: [
    validateLength({
      max: 2000,
      message: 'Text is too long (max 2000 characters)',
    }),
  ],
};

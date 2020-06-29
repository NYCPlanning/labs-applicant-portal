import {
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpFirstname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpLastname: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpEmail: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpZipcode: [
    validateLength({
      min: 0,
      max: 5,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCity: [
    validateLength({
      min: 0,
      max: 80,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpPhone: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpAddress: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};

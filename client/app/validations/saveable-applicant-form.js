import {
  validateFormat,
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
    validateFormat({
      type: 'email',
      // Set allowBlank=true so that the validation message
      // only appears after user first types sometihng.
      // This field still indicates it is 'required'
      // through validatePresence within
      // submittable-applicant-form
      allowBlank: true,
      message: 'Must be a valid email address',
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
    validateFormat({
      type: 'phone',
      // Set allowBlank=true so that the validation message
      // only appears after user first types sometihng.
      // This field still indicates it is 'required'
      // through validatePresence within
      // submittable-applicant-form
      allowBlank: true,
      message: 'Please enter a 10 digit phone number',
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

import {
  validateLength,
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  dcpProjectname: [
    validateLength({
      min: 0,
      max: 50,
      message: "Text is too long (max {max} characters)",
    }),
    validatePresence({
      presence: true,
      message: "This field is required",
    }),
  ],
  emailaddress1: [
    validateLength({
      min: 0,
      max: 50,
      message: "Text is too long (max {max} characters)",
    }),
    validatePresence({
      presence: true,
      message: "This field is required",
    }),
    validateFormat({
      type: "email",
      // Set allowBlank=true so that the validation message
      // only appears after user first types sometihng.
      // This field still indicates it is 'required'
      // through validatePresence within
      // submittable-applicant-form
      allowBlank: true,
      message: "Must be a valid email address",
    }),
  ],
};



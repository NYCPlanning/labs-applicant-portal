import {
  validateFormat,
  validateLength,
  validatePresence,
} from 'ember-changeset-validations/validators';
import validateFileUpload from '../validators/validate-file-presence';

export default {
  primaryContactFirstName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  primaryContactLastName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  primaryContactEmail: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
    validateFormat({
      type: 'email',
      // Set allowBlank=true so that the validation message
      // only appears after user first types something.
      // This field still indicates it is 'required'
      // through validatePresence
      allowBlank: true,
      message: 'Must be a valid email address',
    }),
  ],
  primaryContactPhone: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  applicantFirstName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  applicantLastName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  applicantEmail: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
    validateFormat({
      type: 'email',
      // Set allowBlank=true so that the validation message
      // only appears after user first types something.
      // This field still indicates it is 'required'
      // through validatePresence
      allowBlank: true,
      message: 'Must be a valid email address',
    }),
  ],
  applicantPhone: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  projectName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  borough: [
    validatePresence({
      presence: true,
      message: 'Please select a Borough',
    }),
  ],
  applicantType: [
    validatePresence({
      presence: true,
      message: 'Please select an Applicant Type',
    }),
  ],
  projectBrief: [
    validateLength({
      min: 0,
      max: 500,
      message: 'Text is too long (max {max} characters)',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  documents: [
    validateFileUpload({
      message: 'One or more document uploads is required.',
    }),
  ],
};

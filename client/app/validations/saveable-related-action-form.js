import { validateLength } from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpReferenceapplicationno: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpApplicationdescription: [
    validateLength({
      min: 0,
      max: 250,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpDispositionorstatus: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpCalendarnumbercalendarnumber: [
    validateLength({
      min: 0,
      max: 100,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};

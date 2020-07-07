import {
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
export default {
  dcpModifiedzrsectionnumber: [
    validateLength({
      min: 0,
      max: 25,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};

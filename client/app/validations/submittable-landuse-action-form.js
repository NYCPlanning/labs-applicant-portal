import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  dcpApplicantispublicagencyactions: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};

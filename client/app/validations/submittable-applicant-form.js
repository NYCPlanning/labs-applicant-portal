import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveableApplicantForm from './saveable-applicant-form';

export default {
  ...SaveableApplicantForm,
  dcpFirstname: [
    ...SaveableApplicantForm.dcpFirstname,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpLastname: [
    ...SaveableApplicantForm.dcpLastname,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpEmail: [
    ...SaveableApplicantForm.dcpEmail,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};

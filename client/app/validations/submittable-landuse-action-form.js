import { validatePresence } from 'ember-changeset-validations/validators';
import SaveableLanduseActionForm from './saveable-landuse-action-form';

export default {
  ...SaveableLanduseActionForm,
  dcpApplicantispublicagencyactions: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};

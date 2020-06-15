import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveableRwcdsForm from './saveable-rwcds-form';

export default {
  ...SaveableRwcdsForm,
  dcpRwcdsexplanation: [
    ...SaveableRwcdsForm.dcpRwcdsexplanation,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpWhichactionsfromotheragenciesaresought: [
    ...SaveableRwcdsForm.dcpWhichactionsfromotheragenciesaresought,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpProjectsitedescription: [
    ...SaveableRwcdsForm.dcpProjectsitedescription,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpProposedprojectdevelopmentdescription: [
    ...SaveableRwcdsForm.dcpProposedprojectdevelopmentdescription,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};

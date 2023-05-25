import { validatePresence } from 'ember-changeset-validations/validators';
import validatePresenceIf from '../validators/required-if-selected';
import SaveableRwcdsForm from './saveable-rwcds-form';

export default {
  ...SaveableRwcdsForm,
  dcpRwcdsexplanation: [
    ...SaveableRwcdsForm.dcpRwcdsexplanation,
    validatePresenceIf({
      presence: true,
      on: 'dcpIsrwcdsscenario',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpWhichactionsfromotheragenciesaresought: [
    ...SaveableRwcdsForm.dcpWhichactionsfromotheragenciesaresought,
    validatePresenceIf({
      presence: true,
      on: 'dcpIsapplicantseekingaction',
      withValue: 717170000,
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

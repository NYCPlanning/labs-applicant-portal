import SaveablePasForm from './saveable-pas-form';
import validatePresenceIf from '../validators/required-if-selected';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    ...SaveablePasForm.dcpRevisedprojectname,
  ],
  dcpUrbanareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpUrbanrenewalarea',
      withValue: 717170000,
    }),
  ],
};

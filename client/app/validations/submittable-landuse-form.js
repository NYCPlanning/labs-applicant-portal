import SaveableLanduseForm from './saveable-landuse-form';
import validatePresenceIf from '../validators/required-if-selected';

export default {
  ...SaveableLanduseForm,
  dcpBoroughs: [
    ...SaveableLanduseForm.dcpBoroughs,
    validatePresenceIf({
      presence: true,
      on: 'dcpEntiretyboroughs',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpCommunity: [
    ...SaveableLanduseForm.dcpCommunity,
    validatePresenceIf({
      presence: true,
      on: 'dcpEntiretycommunity',
      withValue: true,
      message: 'This field is required',
    }),
  ],
};

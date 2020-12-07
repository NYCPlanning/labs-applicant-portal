import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import validatePresenceIf from '../validators/required-if-selected';

export default {
  dcpIsthesoleaapplicantagovtagency: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpProjectspolelyconsistactionsnotmeasurable: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsthesoleaapplicantagovtagency',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
  dcpSquarefeet: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectspolelyconsistactionsnotmeasurable',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
  dcpProjectmodificationtoapreviousapproval: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectspolelyconsistactionsnotmeasurable',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
  dcpRespectivedecrequired: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectspolelyconsistactionsnotmeasurable',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
};

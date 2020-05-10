import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveablePasForm from './saveable-pas-form';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    ...SaveablePasForm.dcpRevisedprojectname,
  ],
  dcpUrbanareaname: [
    validatePresence(true),
  ],
  dcpPleaseexplaintypeiienvreview: [
    validatePresence(true),
  ],
  dcpProjectareaindutrialzonename: [ // sic
    validatePresence(true),
  ],
  dcpProjectarealandmarkname: [
    validatePresence(true),
  ],
  dcpProposeddevelopmentsiteotherexplanation: [
    validatePresence(true),
  ],
  dcpInclusionaryhousingdesignatedareaname: [
    validatePresence(true),
  ],
  dcpHousingunittype: [
    validatePresence(true),
  ],
};

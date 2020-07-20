import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';
import SaveablePasForm from './saveable-pas-form';
import validatePresenceIf from '../validators/required-if-selected';
import validateNumberIf from '../validators/validate-number-if';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    ...SaveablePasForm.dcpRevisedprojectname,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpUrbanareaname: [
    ...SaveablePasForm.dcpUrbanareaname,
    validatePresenceIf({
      presence: true,
      on: 'dcpUrbanrenewalarea',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
  dcpPleaseexplaintypeiienvreview: [
    ...SaveablePasForm.dcpPleaseexplaintypeiienvreview,
    validatePresenceIf({
      presence: true,
      on: 'dcpLanduseactiontype2',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
  dcpProjectareaindutrialzonename: [
    ...SaveablePasForm.dcpProjectareaindutrialzonename,
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectareaindustrialbusinesszone',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpProjectarealandmarkname: [
    ...SaveablePasForm.dcpProjectarealandmarkname,
    validatePresenceIf({
      presence: true,
      on: 'dcpIsprojectarealandmark',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpProposeddevelopmentsiteotherexplanation: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProposeddevelopmentsiteinfoother',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpInclusionaryhousingdesignatedareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsinclusionaryhousingdesignatedarea',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpHousingunittype: [
    validatePresenceIf({
      presence: true,
      on: 'dcpDiscressionaryfundingforffordablehousing',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
  dcpZoningauthorizationpursuantto: [
    ...SaveablePasForm.dcpZoningauthorizationpursuantto,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningauthorizationtomodify: [
    ...SaveablePasForm.dcpZoningauthorizationtomodify,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningtomodify: [
    ...SaveablePasForm.dcpZoningtomodify,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningpursuantto: [
    ...SaveablePasForm.dcpZoningpursuantto,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpExistingmapamend: [
    ...SaveablePasForm.dcpExistingmapamend,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningmapamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpProposedmapamend: [
    ...SaveablePasForm.dcpProposedmapamend,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningmapamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpZoningspecialpermitpursuantto: [
    ...SaveablePasForm.dcpZoningspecialpermitpursuantto,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningspecialpermittomodify: [
    ...SaveablePasForm.dcpZoningspecialpermittomodify,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpAffectedzrnumber: [
    ...SaveablePasForm.dcpAffectedzrnumber,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningtextamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpZoningresolutiontitle: [
    ...SaveablePasForm.dcpZoningresolutiontitle,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningtextamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPreviousulurpnumbers1: [
    ...SaveablePasForm.dcpPreviousulurpnumbers1,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfmodification',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPreviousulurpnumbers2: [
    ...SaveablePasForm.dcpPreviousulurpnumbers2,
    validatePresenceIf({
      presence: true,
      on: 'dcpPfrenewal',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPfzoningauthorization: [
    ...SaveablePasForm.dcpPfzoningauthorization,
    validateNumberIf({
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0',
    }),
  ],
  dcpPfzoningcertification: [
    ...SaveablePasForm.dcpPfzoningcertification,
    validateNumberIf({
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0',
    }),
  ],
  dcpPfzoningspecialpermit: [
    ...SaveablePasForm.dcpPfzoningspecialpermit,
    validateNumberIf({
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0',
    }),
  ],

  applicants: [
    validateLength({
      min: 1,
      message: 'One or more applicant team members is required.',
    }),
  ],
};

import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  withLandUseActions: trait({
    dcpRevisedprojectname: 'Testing form',
    dcpPfzoningcertification: 21,
    dcpZoningpursuantto: 'some value',
    dcpZoningtomodify: 'some other val',
    dcpPfzoningtextamendment: 2,
    dcpAffectedzrnumber: '',
    dcpZoningresolutiontitle: '',
    dcpPfchangeincitymap: 4,
  }),

  withRadioButtonAnswers: trait({
    dcpProposedprojectorportionconstruction: 717170000,
    dcpUrbanrenewalarea: 717170001,
    dcpLegalstreetfrontage: 717170003,
    dcpLanduseactiontype2: 717170001,
    dcpProjectareaindustrialbusinesszone: false,
    dcpIsprojectarealandmark: false,
    dcpProjectareacoastalzonelocatedin: true,
    dcpProjectareaischancefloodplain: 717170002,
    dcpRestrictivedeclaration: true,
    dcpRestrictivedeclarationrequired: 717170002,
    dcpIsinclusionaryhousingdesignatedarea: true,
    dcpDiscressionaryfundingforffordablehousing: 717170000,
    dcpHousingunittype: 717170002,
  }),

  withEstimatedCompletionDate: trait({
    dcpEstimatedcompletiondate: new Date('November 1, 2050 03:22:10'),
  }),

  withCheckboxAnswers: trait({
    dcpProposeddevelopmentsitedemolition: true,
    dcpProposeddevelopmentsiteinfoaddition: true,
    dcpProposeddevelopmentsitechnageofuse: true,
  }),
});

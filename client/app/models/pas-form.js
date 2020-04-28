import Model, { belongsTo, attr } from '@ember-data/model';

export default class PasFormModel extends Model {
  @belongsTo
  package;


  // Project Information
  @attr('string')
  dcpRevisedprojectname;


  // Project Geography
  @attr('string')
  dcpDescriptionofprojectareageography;


  // Proposed Land Use Actions
  @attr('string')
  dcpPfchangeincitymap;

  @attr('string')
  dcpPfudaap;

  @attr('string')
  dcpPfsiteselectionpublicfacility;

  @attr('string')
  dcpPfura;

  @attr('string')
  dcpPfacquisitionofrealproperty;

  @attr('string')
  dcpPfhousingplanandproject;

  @attr('string')
  dcpPfdispositionofrealproperty;

  @attr('string')
  dcpPffranchise;

  @attr('string')
  dcpPfrevocableconsent;

  @attr('string')
  dcpPfconcession;

  @attr('string')
  dcpPflandfill;

  @attr('string')
  dcpPfzoningspecialpermit;

  @attr('string')
  dcpZoningspecialpermitpursuantto;

  @attr('string')
  dcpZoningspecialpermittomodify;

  @attr('string')
  dcpPfzoningauthorization;

  @attr('string')
  dcpZoningauthorizationpursuantto;

  @attr('string')
  dcpZoningauthorizationtomodify;

  @attr('string')
  dcpPfzoningcertification;

  @attr('string')
  dcpZoningpursuantto;

  @attr('string')
  dcpZoningtomodify;

  @attr('string')
  dcpPfzoningmapamendment;

  @attr('string')
  dcpExistingmapamend;

  @attr('string')
  dcpProposedmapamend;

  @attr('string')
  dcpPfzoningtextamendment;

  @attr('string')
  dcpAffectedzrnumber;

  @attr('string')
  dcpZoningresolutiontitle;

  @attr('string')
  dcpPreviousulurpnumbers1;

  @attr('string')
  dcpPreviousulurpnumbers2;


  // Project Area
  @attr('string')
  dcpProposedprojectorportionconstruction;

  @attr('string')
  dcpUrbanrenewalarea;

  @attr('string')
  dcpUrbanareaname;

  @attr('string')
  dcpLegalstreetfrontage;

  @attr('string')
  dcpLanduseactiontype2;

  @attr('string')
  dcpPleaseexplaintypeiienvreview;

  @attr('string')
  dcpProjectareaindustrialbusinesszone;

  @attr('string')
  dcpProjectareaindutrialzonename;

  @attr('string')
  dcpIsprojectarealandmark;

  @attr('string')
  dcpProjectarealandmarkname;

  @attr('string')
  dcpProjectareacoastalzonelocatedin;

  @attr('string')
  dcpProjectareaischancefloodplain;

  @attr('string')
  dcpRestrictivedeclaration;

  @attr('string')
  dcpCityregisterfilenumber;

  @attr('string')
  dcpRestrictivedeclarationrequired;


  // Proposed Development Site
  @attr('string')
  dcpEstimatedcompletiondate;

  @attr('string')
  dcpProposeddevelopmentsitenewconstruction;

  @attr('string')
  dcpProposeddevelopmentsitedemolition;

  @attr('string')
  dcpProposeddevelopmentsiteinfoalteration;

  @attr('string')
  dcpProposeddevelopmentsiteinfoaddition;

  @attr('string')
  dcpProposeddevelopmentsitechnageofuse;

  @attr('string')
  dcpProposeddevelopmentsiteenlargement;

  @attr('string')
  dcpProposeddevelopmentsiteinfoother;

  @attr('string')
  dcpProposeddevelopmentsiteotherexplanation;

  @attr('string')
  dcpIsinclusionaryhousingdesignatedarea;

  @attr('string')
  dcpInclusionaryhousingdesignatedareaname;

  @attr('string')
  dcpDiscressionaryfundingforffordablehousing;

  @attr('string')
  dcpHousingunittype;


  // Project Description
  @attr('string')
  dcpProjectdescriptionproposeddevelopment;

  @attr('string')
  dcpProjectdescriptionbackground;

  @attr('string')
  dcpProjectdescriptionproposedactions;

  @attr('string')
  dcpProjectdescriptionproposedarea;

  @attr('string')
  dcpProjectdescriptionsurroundingarea;

  @attr('string')
  dcpProjectattachmentsotherinformation;
}

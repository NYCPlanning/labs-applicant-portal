import Model, { belongsTo, hasMany, attr } from '@ember-data/model';

export default class PasFormModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @hasMany({ async: false })
  applicants;

  @hasMany({ async: false })
  bbls;

  // Project Information
  @attr('string')
  dcpRevisedprojectname;


  // Project Geography
  @attr('string')
  dcpDescriptionofprojectareageography;


  // Proposed Land Use Actions
  @attr('number')
  dcpPfchangeincitymap;

  @attr('number')
  dcpPfudaap;

  @attr('number')
  dcpPfsiteselectionpublicfacility;

  @attr('number')
  dcpPfura;

  @attr('number')
  dcpPfacquisitionofrealproperty;

  @attr('number')
  dcpPfhousingplanandproject;

  @attr('number')
  dcpPfdispositionofrealproperty;

  @attr('number')
  dcpPffranchise;

  @attr('number')
  dcpPfrevocableconsent;

  @attr('number')
  dcpPfconcession;

  @attr('number')
  dcpPflandfill;

  @attr('number')
  dcpPfzoningspecialpermit;

  @attr('number')
  dcpZoningspecialpermitpursuantto;

  @attr('number')
  dcpZoningspecialpermittomodify;

  @attr('number')
  dcpPfzoningauthorization;

  @attr('string')
  dcpZoningauthorizationpursuantto;

  @attr('string')
  dcpZoningauthorizationtomodify;

  @attr('number')
  dcpPfzoningcertification;

  @attr('string')
  dcpZoningpursuantto;

  @attr('string')
  dcpZoningtomodify;

  @attr('number')
  dcpPfzoningmapamendment;

  @attr('string')
  dcpExistingmapamend;

  @attr('string')
  dcpProposedmapamend;

  @attr('number')
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

  // Options -- 717170000: Yes, 717170001: No,
  // 717170002: Unsure at this time, Default: N/A
  @attr('string')
  dcpProposedprojectorportionconstruction;

  // Options -- 717170000: Yes, 717170001: No,
  // 717170002: Unsure at this time, Default: N/A
  @attr('string')
  dcpUrbanrenewalarea;

  @attr('string')
  dcpUrbanareaname;

  // Options -- 717170000: Mapped and Build, 717170001: Private Road,
  // 717170002: Record Street, 717170003: Corporation Counsel Opinion,
  // 717170004: Mapped but not Build, Default: N/A"
  @attr('string')
  dcpLegalstreetfrontage;

  // Options -- 717170000: Yes, 717170001: No,
  // 717170002: Unsure at this time, Default: N/A
  @attr('string')
  dcpLanduseactiontype2;

  @attr('string')
  dcpPleaseexplaintypeiienvreview;

  @attr('boolean')
  dcpProjectareaindustrialbusinesszone;

  @attr('string')
  dcpProjectareaindutrialzonename;

  @attr('boolean')
  dcpIsprojectarealandmark;

  @attr('boolean')
  dcpProjectarealandmarkname;

  @attr('boolean')
  dcpProjectareacoastalzonelocatedin;

  // Options -- 717170000: Yes, 717170001: No,
  // 717170002: Unsure at this time, Default: N/A
  @attr('string')
  dcpProjectareaischancefloodplain;

  @attr('boolean')
  dcpRestrictivedeclaration;

  @attr('string')
  dcpCityregisterfilenumber;

  // Options -- 717170000: No, 717170001: Yes,
  // 717170002: Cannot Determine at this time, Default: N/A
  @attr('string')
  dcpRestrictivedeclarationrequired;

  // Proposed Development Site
  @attr('date')
  dcpEstimatedcompletiondate;

  @attr('boolean')
  dcpProposeddevelopmentsitenewconstruction;

  @attr('boolean')
  dcpProposeddevelopmentsitedemolition;

  @attr('boolean')
  dcpProposeddevelopmentsiteinfoalteration;

  @attr('boolean')
  dcpProposeddevelopmentsiteinfoaddition;

  @attr('boolean')
  dcpProposeddevelopmentsitechnageofuse;

  @attr('boolean')
  dcpProposeddevelopmentsiteenlargement;

  @attr('boolean')
  dcpProposeddevelopmentsiteinfoother;

  @attr('string')
  dcpProposeddevelopmentsiteotherexplanation;

  @attr('boolean')
  dcpIsinclusionaryhousingdesignatedarea;

  @attr('string')
  dcpInclusionaryhousingdesignatedareaname;

  // Options -- 717170000: Yes, 717170001: No,
  // 717170002: Unsure at this time, Default: N/A
  @attr('string')
  dcpDiscressionaryfundingforffordablehousing;

  // Options -- 717170000: City, 717170001: State,
  // 717170002: Federal, 717170003: Other, Default: N/A
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

  async saveDirtyBbls() {
    return Promise.all(
      this.bbls
        .filter((bbl) => bbl.hasDirtyAttributes)
        .map((bbl) => bbl.save()),
    );
  }

  async saveDirtyApplicants() {
    return Promise.all(
      this.applicants
        .filter((applicant) => applicant.hasDirtyAttributes)
        .map((applicant) => applicant.save()),
    );
  }
}

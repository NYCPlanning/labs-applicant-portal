import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class LanduseFormModel extends Model {
  @belongsTo('package', { async: false })
  package;

  @hasMany('applicant', { async: false })
  applicants;

  @hasMany('landuse-action', { async: false })
  landuseActions;

  @hasMany('bbl', { async: false })
  bbls;

  @hasMany('related-action', { async: false })
  relatedActions;

  @attr dcpVersion;

  // project name
  @attr dcpProject;

  @attr dcpContactname;

  @attr dcpContactphone;

  @attr dcpContactemail;

  @attr dcpSitedataadress;

  @attr dcpCitycouncil;

  @attr dcpSitedatacommunitydistrict;

  @attr dcpSitedatazoningsectionnumbers;

  @attr dcpSitedataexistingzoningdistrict;

  @attr dcpSpecialdistricts;

  @attr dcpWholecity;

  @attr dcpEntiretyboroughs;

  @attr dcpBoroughs;

  @attr dcpEntiretycommunity;

  @attr dcpCommunity;

  @attr dcpNotaxblock;

  @attr dcpSitedatapropertydescription;

  @attr dcpZonesspecialdistricts;

  @attr dcpStateczm;

  @attr dcpHistoricdistrict;

  @attr dcpSitedatarenewalarea;

  @attr dcp500kpluszone;

  @attr dcpDevsize;

  @attr dcpSitedatasiteisinnewyorkcity;

  @attr dcpSitedataidentifylandmark;

  @attr dcpLeadagency;

  @attr dcpCeqrnumber;

  @attr dcpCeqrtype;

  @attr dcpTypecategory;

  @attr dcpDeterminationdate;
}

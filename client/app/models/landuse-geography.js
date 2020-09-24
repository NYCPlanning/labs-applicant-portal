import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanduseGeographyModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr dcpCommunityfacilitycommercialnooffirms;

  @attr dcpIsthesiteimprovedunimprovedorpartlyimp;

  @attr dcpSitenumbertext;

  @attr dcpName;

  @attr dcpBorough;

  @attr dcpNumberofdwellingunits;

  @attr dcpUsesonsite;

  @attr dcpBuildingsorsitetotalsquarefootage;

  @attr dcpLocationsiteinbuilding;

  @attr dcpSitenumber;

  @attr dcpOwnership;

  @attr dcpDisplacementorrelocation;

  @attr dcpLot;

  @attr dcpSquarefootagetobeacquired;

  @attr dcpBlock;

  @attr dcpNumberoffloorsinbuilding;

  @attr dcpCommunityfacilitycommercialnoofemployees;

  @attr dcpLandusegeographyid;

  @attr dcpVacantforlessthantwoyears;
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanduseGeographyModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr('number', { defaultValue: null })
  dcpCommunityfacilitycommercialnooffirms;

  @attr dcpIsthesiteimprovedunimprovedorpartlyimp;

  @attr dcpSitenumbertext;

  @attr dcpName;

  @attr dcpBorough;

  @attr('number', { defaultValue: null })
  dcpNumberofdwellingunits;

  @attr dcpUsesonsite;

  @attr('number', { defaultValue: null })
  dcpBuildingsorsitetotalsquarefootage;

  @attr dcpLocationsiteinbuilding;

  @attr dcpSitenumber;

  @attr dcpOwnership;

  @attr dcpDisplacementorrelocation;

  @attr dcpLot;

  @attr('number', { defaultValue: null })
  dcpSquarefootagetobeacquired;

  @attr dcpBlock;

  @attr dcpNumberoffloorsinbuilding;

  @attr('number', { defaultValue: null })
  dcpCommunityfacilitycommercialnoofemployees;

  @attr dcpLandusegeographyid;

  @attr dcpVacantforlessthantwoyears;
}

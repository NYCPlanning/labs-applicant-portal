import Model, { attr, belongsTo } from '@ember-data/model';

export default class ZoningMapChangeModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr versionnumber;

  @attr dcpProposedzoningmapvalue;

  @attr statuscode;

  @attr overriddencreatedon;

  @attr modifiedon;

  @attr createdon;

  @attr statecode;

  @attr dcpZoningsectionmapsnumber;

  @attr dcpProposedzoningdistrictvalue;

  @attr dcpChangenumber;

  @attr importsequencenumber;

  @attr dcpNumber;

  @attr utcconversiontimezonecode;

  @attr dcpZoningmapchangesid;

  @attr dcpExistingzoningdistrictvalue;

  @attr dcpName;
}

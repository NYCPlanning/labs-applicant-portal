import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectAddressModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  @attr('string') dcpValidatedpostalcode;

  @attr('date') modifiedon;

  @attr('string') dcpDmsourceid;

  @attr('string') dcpName;

  @attr('number') dcpValidatedxcoordinate;

  @attr('date') overriddencreatedon;

  @attr('number') dcpValidatedccd;

  @attr('date') createdon;

  @attr('number') dcpUserinputborough;

  @attr('boolean') dcpAddressvalidated;

  @attr('string') dcpUserinputaddressnumber;

  @attr('string') dcpValidatedstreet;

  @attr('string') dcpResponsewarning;

  @attr('string') dcpUserinputunit;

  @attr('number') versionnumber;

  @attr('date') dcpMigratedlastupdateddate;

  @attr('number') statuscode;

  @attr('number') dcpValidatedycoordinate;

  @attr('number') dcpValidatedborough;

  @attr('string') dcpResponseerror;

  @attr('number') dcpValidatedcd;

  @attr('number') timezoneruleversionnumber;

  @attr('string') dcpValidatedzm;

  @attr('string') dcpValidatedaddressnumber;

  @attr('number') importsequencenumber;

  @attr('string') dcpDcpValidatedbintext;

  @attr('number') utcconversiontimezonecode;

  @attr('string') dcpUserinputstreet;

  @attr('string') dcpValidatedstreetcode;

  @attr('string') dcpConcatenatedaddressvalidated;

  @attr('boolean') dcpValidatedaddressoverride;

  @attr('date') dcpAddressvalidateddate;

  @attr('number') statecode;
}

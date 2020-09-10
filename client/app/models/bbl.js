import Model, { attr, belongsTo } from '@ember-data/model';

export default class BblModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  @belongsTo('project')
  project;

  @attr
  dcpBblnumber;

  @attr('boolean', { allowNull: true })
  dcpDevelopmentsite;

  @attr
  dcpPartiallot;

  @attr('number')
  dcpUserinputborough;

  @attr('string')
  dcpUserinputblock;

  @attr('string')
  dcpUserinputlot;
}

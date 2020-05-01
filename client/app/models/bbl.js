import Model, { attr, belongsTo } from '@ember-data/model';

export default class BblModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  @attr
  dcpBblnumber;

  @attr('boolean', { allowNull: true })
  dcpDevelopmentsite;

  @attr
  dcpPartiallot;
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectActionModel extends Model {
  @belongsTo('rwcds-form')
  rwcdsForm;

  @attr
  dcpZoningresolutiontype;

  @attr
  dcpZrsectionnumber;

  @attr
  dcpModifiedzrsectionnumber;
}

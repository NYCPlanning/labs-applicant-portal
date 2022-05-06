import Model, { attr, belongsTo } from '@ember-data/model';

export default class ArtifactModel extends Model {
  @belongsTo('project', { async: false })
  project;

  @attr()
  dcpName;
}

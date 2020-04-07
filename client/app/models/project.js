import Model, { attr } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr name;

  @attr primaryApplicant;

  @attr({ defaultValue: () => [] }) packages;
}

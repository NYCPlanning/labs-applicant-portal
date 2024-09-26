import Model, { attr } from '@ember-data/model';

export default class ProjectNewModel extends Model {
    @attr('string', { defaultValue: 'default project name in model' }) dcpProjectname;
}

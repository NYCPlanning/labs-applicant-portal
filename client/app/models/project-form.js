import Model, { belongsTo } from '@ember-data/model'

export default class ProjectFormModel extends Model {
    @belongsTo('package', { async: false})
    package;
}
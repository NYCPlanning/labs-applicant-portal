import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectNewController extends Controller {
    @service
    store;

    @action
    async saveProjectNew(projectNew) {
        const createProjectNew = await this.store.createRecord('project-new', {
            dcpProjectname: 'new project name'
        })

        await createProjectNew.save();
    }
}
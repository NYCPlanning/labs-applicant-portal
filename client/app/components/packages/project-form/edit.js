import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import SubmittablePackageFormValidations from '../../../validations/submittable-project-form';
import SaveableProjectFormValidations from '../../../validations/saveable-project-form';
import SubmittableProjectFormValidations from '../../../validations/submittable-project-form';

export default class ProjectFormComponent extends Component {
    validations = {
        SubmittablePackageFormValidations 
    }

    @service
    router;

    @service
    store;

    get package() {
        return this.args.package || {};
    }

    get projectForm() {
        return this.package.projectForm || {};
    }

    @action
    async submitPackage() {
        await this.args.package.submit();

        this.router.transitionTo('projects')
    }
}
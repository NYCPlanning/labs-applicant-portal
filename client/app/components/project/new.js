import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import SubmittableProjectFormValidations from '../../validations/submittable-project-form';

export default class ProjectNewComponent extends Component {
    validations = {
        SubmittableProjectFormValidations,
    }

    @tracked _dcpProjectname = 'default project name';

    @action
    updateDcpProjectname (event) {
        console.debug("dcp project change value", event.target.value);
        this._dcpProjectname = event.target.value;
    }

    @action
    async submitPackage() {
        await this.args.package.submit();
    }
}
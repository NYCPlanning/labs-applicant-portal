import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";

export default class ProjectNewComponent extends Component {
    @tracked _dcpProjectname = 'default project name';

    @action
    updateDcpProjectname (event) {
        console.debug("dcp project change value", event.target.value);
        this._dcpProjectname = event.target.value;
    }
}
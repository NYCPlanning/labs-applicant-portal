import Component from '@glimmer/component';
import { dasherize } from '@ember/string';

export default class SaveableFormSectionComponent extends Component {
  elementId = dasherize(this.args.title || '');
}

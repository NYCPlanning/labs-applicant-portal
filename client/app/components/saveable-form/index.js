import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-maps-and-sets';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SaveableFormComponent extends Component {
  get validators() {
    return this.args.validators || [{}, {}];
  }

  sections = new TrackedSet();

  get sectionData() {
    return Array.from(this.sections).map((section) => ({ label: section.args.title, anchorId: section.elementId }));
  }

  @action
  registerSection(section) {
    this.sections.add(section);
  }

  @tracked
  modalIsOpen = false;

  @action
  toggleModal() {
    this.modalIsOpen = !this.modalIsOpen;
  }
}

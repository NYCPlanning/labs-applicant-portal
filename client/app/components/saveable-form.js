import Component from '@glimmer/component';
import { TrackedSet } from 'tracked-maps-and-sets';
import { action } from '@ember/object';

export default class SaveableFormComponent extends Component {
  sections = new TrackedSet();

  get sectionData() {
    return Array.from(this.sections).map((section) => ({ label: section.args.title, anchorId: section.elementId }));
  }

  @action
  registerSection(section) {
    this.sections.add(section);
  }
}

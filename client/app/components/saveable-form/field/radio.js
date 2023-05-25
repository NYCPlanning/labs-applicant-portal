import RadioButtonComponent from 'ember-radio-button/components/radio-button';
import { guidFor } from '@ember/object/internals';

export default class GroupIdentifier extends RadioButtonComponent {
  radioId = `radio-${guidFor(this)}`;

  checkedClass = 'checked';
}

import Component from '@glimmer/component';

export default class SaveableFormFieldComponent extends Component {
  get value() {
    return this.args.data[this.args.attribute];
  }

  set value(newValue) {
    this.args.data[this.args.attribute] = newValue;
  }

  get error() {
    return this.args.error[this.args.attribute];
  }

  get type() {
    return this.args.type || 'text-input';
  }
}

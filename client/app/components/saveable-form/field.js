import Component from '@glimmer/component';
import { get } from '@ember/object';

export default class SaveableFormFieldComponent extends Component {
  get value() {
    console.log("this.args.data", this.args.data);
    const value = this.args.data[this.args.attribute] ? this.args.data[this.args.attribute] : '';
    console.log("getting value in field js", value ? value : "failed getting value");
    return value;
  }

  set value(newValue) {
    console.log("setting value in field js", this.args.data[this.args.attribute] ? this.args.data[this.args.attribute] : "failed setting value");
    this.args.data[this.args.attribute] = newValue;
  }

  get error() {
    return this.args.error[this.args.attribute];
  }

  get type() {
    return this.args.type || 'text-input';
  }
}

import Component from '@glimmer/component';

export default class SaveableFormFieldComponent extends Component {
  get value() {
    // console.log('');
    // console.log('getting value in field js', this.args.data[this.args.attribute] ? this.args.data[this.args.attribute] : 'failed getting value');
    return this.args.data[this.args.attribute];
  }

  set value(newValue) {
    // console.log('');
    // console.log('setting value in field js', this.args.data[this.args.attribute] ? this.args.data[this.args.attribute] : 'failed setting value');
    this.args.data[this.args.attribute] = newValue;
  }

  get error() {
    return this.args.error[this.args.attribute];
  }

  get type() {
    return this.args.type || 'text-input';
  }
}

import Component from '@glimmer/component';

export default class SaveableFormFieldComponent extends Component {
  get value() {
    const getValue =  this.args.data[this.args.attribute] ? this.args.data[this.args.attribute] : "Some Cool New Project Name";
     console.log("GET this.args.data[this.args.attribute]",  getValue);
    return getValue;
    // try {
    //   console.log("GET this.args.data",  this.args.data);
    //   return getValue;
    // } catch (e) {
    //   console.log('trouble getting value in field.js', e);
    // }
  }

  set value(newValue) {
    console.log("the new value BEFORE setting it", newValue);
    this.args.data[this.args.attribute] = newValue
    console.log("the new value AFTER setting it",  newValue);

    // try {
    //   this.args.data[this.args.attribute] = newValue ? newValue : "";
    // } catch (err) {
    //   console.log("Error in setting new value in field.js", err);
    // }
  }

  get error() {
    return this.args.error[this.args.attribute];
  }

  get type() {
    return this.args.type || 'text-input';
  }
}

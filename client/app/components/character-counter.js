import Component from '@glimmer/component';

export default class CharacterCounterComponent extends Component {
  get stringLength() {
    return (this.args.string ? this.args.string.length : 0);
  }

  get warningClass() {
    if (this.stringLength > this.args.maxlength) {
      return "invalid"
    };
    if ((this.stringLength / this.args.maxlength) > 0.9) {
      return "warning"
    };
    return
  }
}

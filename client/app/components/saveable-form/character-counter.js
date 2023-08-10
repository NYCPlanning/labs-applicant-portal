import Component from '@glimmer/component';

export default class CharacterCounterComponent extends Component {
  get stringLength() {
    const val = this.args.string; // Could be type number or string
    if (val === null || val === undefined) return 0;
    return val.toString().length;
  }

  get warningClass() {
    if (this.stringLength > this.args.maxlength) {
      return 'invalid';
    }
    if ((this.stringLength / this.args.maxlength) > 0.8) {
      return 'warning';
    }
    return null;
  }
}

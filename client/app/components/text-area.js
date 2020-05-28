import Component from '@glimmer/component';

export default class TextAreaComponent extends Component {
  maxlength = this.args.maxlength || '2000';
}

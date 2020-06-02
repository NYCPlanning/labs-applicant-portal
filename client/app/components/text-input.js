import Component from '@glimmer/component';

export default class TextInputComponent extends Component {
  maxlength = this.args.maxlength || '250';
}

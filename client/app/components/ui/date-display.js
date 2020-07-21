import Component from '@glimmer/component';

// Unfortunately, moment-format's allow-empty flag is not yet stable.
// So we manually handle undefined dates through this component.
// https://github.com/stefanpenner/ember-moment#common-optional-named-arguments
export default class DateDisplayComponent extends Component {
  tagName = '';

  // message to display if invalid date
  errorMessage = 'Date Unknown';
}

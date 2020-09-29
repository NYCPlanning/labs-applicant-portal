import Component from '@glimmer/component';
import { optionset } from '../../../helpers/optionset';

export default class PackagesLanduseFormProposedActionEditorComponent extends Component {
  actionCode;

  get selectedActionPlaceholder() {
    const previouslyApprovedActionCode = this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode;
    if (previouslyApprovedActionCode) {
      return optionset(['landuseAction', 'dcpPreviouslyapprovedactioncode', 'label', previouslyApprovedActionCode]);
    } return '-- select an action --';
  }
}

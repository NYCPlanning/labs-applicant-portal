import Component from '@glimmer/component';
import { action } from '@ember/object';
import { optionset } from '../../../helpers/optionset';

export default class PackagesLanduseFormProposedActionEditorComponent extends Component {
  actionCode;

  requiredActionCodes = ['CM', 'LD', 'RA', 'RC', 'RS', 'SA', 'SC', 'SD', 'ZA', 'ZC', 'ZS'];

  get projectHasRequiredActions() {
    const actionCode = this.args.landuseActionForm.data.dcpActioncode;
    return this.requiredActionCodes.includes(actionCode);
  }

  get projectHasRequiredActionsAndFollowUpYes() {
    return this.projectHasRequiredActions && this.args.landuseActionForm.data.dcpFollowuptopreviousaction === true;
  }

  get selectedActionPlaceholder() {
    const previouslyApprovedActionCode = this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode;
    if (previouslyApprovedActionCode) {
      return optionset(['landuseAction', 'dcpPreviouslyapprovedactioncode', 'label', previouslyApprovedActionCode]);
    } return '-- select an action --';
  }

  @action
  setPreviouslyApprovedActionCodeFields(actionCode) {
    this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode = actionCode;
    if (actionCode) {
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = true;
    } else {
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = false;
    }
  }
}

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
    const hasPreviousAction = this.args.landuseActionForm.data.dcpFollowuptopreviousaction || this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode;
    return this.projectHasRequiredActions && hasPreviousAction;
  }

  get selectedActionPlaceholder() {
    const previouslyApprovedActionCode = this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode;
    if (previouslyApprovedActionCode) {
      return optionset(['landuseAction', 'dcpPreviouslyapprovedactioncode', 'label', previouslyApprovedActionCode]);
    } return '-- select an action --';
  }

  @action
  setPreviouslyApprovedActionCodeFields(actionCode) {
    if (actionCode) {
      this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode = actionCode;
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = true;
    } else if (!actionCode && !this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode) {
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = false;
    }
  }
}

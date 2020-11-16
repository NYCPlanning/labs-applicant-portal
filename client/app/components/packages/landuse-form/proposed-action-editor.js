import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { optionset } from '../../../helpers/optionset';

export default class PackagesLanduseFormProposedActionEditorComponent extends Component {
  @tracked chosenDcpPreviouslyapprovedactioncode = this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode
    ? {
      code: this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode,
      label: optionset(['landuseAction', 'dcpPreviouslyapprovedactioncode', 'label', this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode]),
    } : null;

  requiredActionCodes = ['CM', 'LD', 'RA', 'RC', 'RS', 'SA', 'SC', 'SD', 'ZA', 'ZC', 'ZS'];

  get projectHasRequiredActions() {
    const actionCode = this.args.landuseActionForm.data.dcpActioncode;
    return this.requiredActionCodes.includes(actionCode);
  }

  get projectHasRequiredActionsAndFollowUpYes() {
    const hasPreviousAction = this.args.landuseActionForm.data.dcpFollowuptopreviousaction || this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode;
    return this.projectHasRequiredActions && hasPreviousAction;
  }

  @action
  setPreviouslyApprovedActionCodeFields(actionCode) {
    if (actionCode) {
      this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode = actionCode;
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = true;
    } else {
      this.args.landuseActionForm.data.dcpPreviouslyapprovedactioncode = null;
      this.args.landuseActionForm.data.dcpFollowuptopreviousaction = false;
    }
  }

  @action
  clearPreviouslyApprovedActionCodeDropdown(landuseActionFormData) {
    this.chosenDcpPreviouslyapprovedactioncode = null;
    landuseActionFormData.dcpPreviouslyapprovedactioncode = null;
    landuseActionFormData.dcpFollowuptopreviousaction = false;
  }
}

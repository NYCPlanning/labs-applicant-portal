import Component from '@glimmer/component';

export default class PackagesLanduseFormProposedActionsComponent extends Component {
  requiredActionCodes = [
    'ZS',
    'ZA',
    'ZC',
    'CM',
    'LD',
    'RA',
    'RC',
    'RS',
    'SD',
    'SA',
    'SC',
  ];

  get projectHasRequiredActions() {
    const projectActions = this.args.form.data.landuseActions;
    const projectActionCodes = projectActions.map(
      (action) => action.dcpActioncode,
    );
    const matchingActions = this.requiredActionCodes.filter((actionCode) => projectActionCodes.includes(actionCode));
    return matchingActions.length > 0;
  }
}

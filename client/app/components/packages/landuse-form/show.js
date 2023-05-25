import Component from '@glimmer/component';

export default class PackagesLanduseFormShowComponent extends Component {
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

  // todo: Rename projectHasRequiredActions [ask Godfrey for detail]

  get projectHasRequiredActions() {
    const projectActions = this.args.package.landuseForm.landuseActions;
    const projectActionCodes = projectActions.map(
      (action) => action.dcpActioncode,
    );
    const matchingActions = this.requiredActionCodes.filter((actionCode) => projectActionCodes.includes(actionCode));
    return matchingActions.length > 0;
  }

  get projectHasCityMapActions() {
    const projecCityMapActions = this.args.package.landuseForm.landuseActions;
    const projecCityMapActionsCodes = projecCityMapActions.map(
      (action) => action.dcpActioncode,
    );
    return (
      projecCityMapActionsCodes.includes('ME')
      || projecCityMapActionsCodes.includes('MM')
      || projecCityMapActionsCodes.includes('MY')
    );
  }
}

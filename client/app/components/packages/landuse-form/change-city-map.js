import Component from '@glimmer/component';

export default class PackagesLanduseFormChangeCityMapComponent extends Component {
  get projectHasActions() {
    const projectActions = this.args.form.data.landuseActions;
    const projectActionsCodes = projectActions.map(
      (action) => action.dcpActioncode,
    );
    return (
      projectActionsCodes.includes('ME')
      || projectActionsCodes.includes('MM')
      || projectActionsCodes.includes('MY')
    );
  }
}

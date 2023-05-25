import Component from '@glimmer/component';

export default class ChangeInCityMapProjectChangeListComponent extends Component {
  get changeInCityMapProjectChangeList() {
    const { landuseForm } = this.args;

    const actions = [
      {
        prop: 'dcpChangestreetwidthopt',
        label: 'Street Width',
      },

      {
        prop: 'dcpChangestreetalignmentopt',
        label: 'Street Alignment',
      },
      {
        prop: 'dcpChangestreetgradeopt',
        label: 'Street Grade',
      },
      {
        prop: 'dcpChangeeasement',
        label: 'Easement',
      },
    ];

    return actions
      .reduce((citymapPropjectChange, type) => {
        if (landuseForm[type.prop]) {
          citymapPropjectChange.push(type.label);
        }
        return citymapPropjectChange;
      }, [])
      .join(', ');
  }
}

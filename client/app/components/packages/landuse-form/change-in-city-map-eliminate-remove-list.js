import Component from '@glimmer/component';

export default class ChangeInCityMapEliminateRemoveListComponent extends Component {
  get changeInCityMapEliminateRemoveList() {
    const { landuseForm } = this.args;

    const actions = [
      {
        prop: 'dcpEliminatestreetopt',
        label: 'Street',
      },
      {
        prop: 'dcpEliminateparkopt',
        label: 'Park',
      },
      {
        prop: 'dcpEliminatepublicplaceopt',
        label: 'Public Place',
      },
      {
        prop: 'dcpEliminategradeopt',
        label: 'Grade',
      },
      {
        prop: 'dcpEliminateeasement',
        label: 'Easement',
      },
    ];

    return actions
      .reduce((citymapEliminateRemove, type) => {
        if (landuseForm[type.prop]) {
          citymapEliminateRemove.push(type.label);
        }
        return citymapEliminateRemove;
      }, [])
      .join(', ');
  }
}

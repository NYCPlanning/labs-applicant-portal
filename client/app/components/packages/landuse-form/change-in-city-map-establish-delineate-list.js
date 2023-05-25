import Component from '@glimmer/component';

export default class ChangeInCityMapEstablishDelineateListComponent extends Component {
  get changeInCityMapEstablishDelineateList() {
    const { landuseForm } = this.args;

    const actions = [
      {
        prop: 'dcpEstablishstreetopt',
        label: 'Street',
      },
      {
        prop: 'dcpEstablishparkopt',
        label: 'Park',
      },
      {
        prop: 'dcpEstablishpublicplaceopt',
        label: 'Public Place',
      },
      {
        prop: 'dcpEstablishgradeopt',
        label: 'Grade',
      },
      {
        prop: 'dcpEstablisheasement',
        label: 'Easement',
      },
    ];

    return actions
      .reduce((citymapEstablishDelineate, type) => {
        if (landuseForm[type.prop]) {
          citymapEstablishDelineate.push(type.label);
        }
        return citymapEstablishDelineate;
      }, [])
      .join(', ');
  }
}

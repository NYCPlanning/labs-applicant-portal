import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LandUseActionComponent extends Component {
  // local variable that records results of dropdown selection
  @tracked selectedLandUseAction = {};

  // actions selected by user in dropdown
  @tracked landUseActionSelections = [];

  // lookup to match action titles to their associated attributes
  @tracked landUseActionOptions = [
    {
      name: 'Acquisition of Real Property', field: 'dcpPfacquisitionofrealproperty', attr1: '', attr2: '',
    },
    {
      name: 'Change in CityMap', field: 'dcpPfchangeincitymap', attr1: '', attr2: '',
    },
    {
      name: 'Concession', field: 'dcpPfconcession', attr1: '', attr2: '',
    },
    {
      name: 'Disposition of Real Property', field: 'dcpPfdispositionofrealproperty', attr1: '', attr2: '',
    },
    {
      name: 'Franchise', field: 'dcpPffranchise', attr1: '', attr2: '',
    },
    {
      name: 'Housing Plan & Project', field: 'dcpPfhousingplanandproject', attr1: '', attr2: '',
    },
    {
      name: 'Landfill', field: 'dcpPflandfill', attr1: '', attr2: '',
    },
    {
      name: 'Modification', field: 'dcpPfmodification', attr1: 'dcpPreviousulurpnumbers1', attr2: '',
    },
    {
      name: 'Renewal', field: 'dcpPfrenewal', attr1: 'dcpPreviousulurpnumbers2', attr2: '',
    },
    {
      name: 'Revocable Consent', field: 'dcpPfrevocableconsent', attr1: '', attr2: '',
    },
    {
      name: 'Site Selection - Public Facility', field: 'dcpPfsiteselectionpublicfacility', attr1: '', attr2: '',
    },
    {
      name: 'UDAAP', field: 'dcpPfudaap', attr1: '', attr2: '',
    },
    {
      name: 'URA', field: 'dcpPfura', attr1: '', attr2: '',
    },
    {
      name: 'Zoning Authorization', field: 'dcpPfzoningauthorization', attr1: 'dcpZoningauthorizationpursuantto', attr2: 'dcpZoningauthorizationtomodify',
    },
    {
      name: 'Zoning Certification', field: 'dcpPfzoningcertification', attr1: 'dcpZoningpursuantto', attr2: 'dcpZoningtomodify',
    },
    {
      name: 'Zoning Map Amendment', field: 'dcpPfzoningmapamendment', attr1: 'dcpExistingmapamend', attr2: 'dcpProposedmapamend',
    },
    {
      name: 'Zoning Special Permit', field: 'dcpPfzoningspecialpermit', attr1: 'dcpZoningspecialpermitpursuantto', attr2: 'dcpZoningspecialpermittomodify',
    },
    {
      name: 'Zoning Text Amendment', field: 'dcpPfzoningtextamendment', attr1: 'dcpAffectedzrnumber', attr2: 'dcpZoningresolutiontitle',
    },
  ];

  // when a user selects an option from the dropdown menu,
  // the option is removed from the landUseActionOptions
  // (and therefore removed from the dropdown).
  // The selected option is added to the landUseActionSelections array
  // (and therefore displays in the list of selected actions).
  @action
  setSelectedActionsArray() {
    this.landUseActionOptions.removeObject(this.selectedLandUseAction);
    // sort options alphabetically
    this.landUseActionOptions.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    // use unshiftObject to place new action at top of list
    this.landUseActionSelections.unshiftObject(this.selectedLandUseAction);
  }

  // When a user deletes an action, the associated fields are reset as well.
  // The selected action option is added back to the landUseActionOptions arrays
  // (and therefore added back to the dropdown).
  @action
  removeSelectedAction(actionToRemove) {
    this.landUseActionOptions.pushObject(actionToRemove);
    // sort options alphabetically
    this.landUseActionOptions.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    this.landUseActionSelections.removeObject(actionToRemove);
    this.args.pasForm[actionToRemove.field] = 0;
    this.args.pasForm[actionToRemove.attr1] = '';
    this.args.pasForm[actionToRemove.attr2] = '';
  }
}

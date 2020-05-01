import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LandUseActionComponent extends Component {
  // represents pasForm model
  @tracked pasForm;

  // local variable that records results of dropdown selection
  selectedLandUseAction = '';

  // lookup to match action titles to their associated attributes
  landUseActionsLookup = {
    'Change in CityMap': 'dcpPfchangeincitymap',
    UDAAP: 'dcpPfudaap',
    'Site Selection - Public Facility': 'dcpPfsiteselectionpublicfacility',
    URA: 'dcpPfura',
    'Acquisition of Real Property': 'dcpPfacquisitionofrealproperty',
    'Housing Plan & Project': 'dcpPfhousingplanandproject',
    'Disposition of Real Property': 'dcpPfdispositionofrealproperty',
    Franchise: 'dcpPffranchise',
    'Revocable Consent': 'dcpPfrevocableconsent',
    Concession: 'dcpPfconcession',
    Landfill: 'dcpPflandfill',
    'Zoning Special Permit': 'dcpPfzoningspecialpermit',
    'Zoning Authorization': 'dcpPfzoningauthorization',
    'Zoning Certification': 'dcpPfzoningcertification',
    'Zoning Map Amendment': 'dcpPfzoningmapamendment',
    'Zoning Text Amendment': 'dcpPfzoningtextamendment',
    Modification: 'dcpPfmodification',
    Renewal: 'dcpPfrenewal',
  };

  // array of action titles for dropdown options
  get landUseActionTextOptions () {
    const options = Object.keys(this.landUseActionsLookup);
    return options;
  }

  // Each of these action attributes represents a "count", which is the number
  // of that type of action that the user has added to their PAS form.
  // This action updates the count; triggered when the user selects an action.
  @action
  setCount() {
    const selectedAction = this.landUseActionsLookup[this.selectedLandUseAction];
    // these attributes are by default undefined
    const currentCount = this.args.pasForm[selectedAction] ? this.args.pasForm[selectedAction] : 0;
    const accCount = currentCount + 1;
    this.args.pasForm[selectedAction] = accCount;
  }
}

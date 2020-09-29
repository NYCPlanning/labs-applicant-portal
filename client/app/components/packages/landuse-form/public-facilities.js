import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PackagesLanduseFormPublicFacilitiesComponent extends Component {
  // The following properties represent lists of fields
  // dependent on the value of a respective radio group.
  // For a radio group property,
  // the associated list of fields are those which should be
  // cleared (reset) when the radio-group value changes.
  dependantsOf = {
    dcpExistingfacilityproposedtoremainopt: [
      'dcpTextexistingfacility',
      'dcpExistingfacilityreplacementinanewlocation',
      'dcpCurrentfacilitylocation',
    ],
    dcpExistingfacilityreplacementinanewlocation: [
      'dcpCurrentfacilitylocation',
    ],
    dcpExistingfacilityproposedtoremainandexpand: [
      'dcpHowlonghasexistingfacilitybeenatthislocat',
    ],
    dcpIsprojectlistedinstatementofneedsopt: [
      'dcpIndicatefiscalyears',
    ],
  }

  get landuseForm() {
    return this.args.form.data;
  }

  @action
  resetDependentFields(fields) {
    fields.forEach((field) => {
      this.landuseForm.set(field, null);
    });
  }
}

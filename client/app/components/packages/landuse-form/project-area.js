import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PackagesLanduseFormProjectAreaComponent extends Component {
  // The following four properties represent lists of fields
  // dependent on the value of a respective radio group.
  // For a radio group property (such as dcpEntiretycommunity),
  // the associated list of fields are those which should be
  // cleared (reset) when the dcpEntiretycommunity value changes.
  dcpNotaxblock = [
    'dcpSitedatapropertydescription',
  ]

  dcpEntiretycommunity = [
    ...this.dcpNotaxblock,
    'dcpNotaxblock',
    'dcpCommunity',
  ];

  dcpEntiretyboroughs = [
    ...this.dcpEntiretycommunity,
    'dcpEntiretycommunity',
    'dcpBoroughs',
  ];

  dcpWholecity = [
    ...this.dcpEntiretyboroughs,
    'dcpEntiretyboroughs',
  ];

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

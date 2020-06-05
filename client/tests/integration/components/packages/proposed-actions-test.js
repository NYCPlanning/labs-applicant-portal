import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  fillIn,
  click,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | proposed-actions', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('user can view and edit affected zoning resolution actions', async function(assert) {
    this.package = this.server.create('package', {
      rwcdsForm: this.server.create('rwcds-form', {
        affectedZoningResolutions: [
          this.server.create('affected-zoning-resolution', {
            dcpZoningresolutiontype: 'ZA',
            dcpZrsectionnumber: 'Section 74 7-11',
            dcpZrsectiontitle: 'Landmark Preservation in all districts',
          }),
          this.server.create('affected-zoning-resolution', {
            dcpZoningresolutiontype: 'HO',
            dcpZrsectionnumber: '',
            dcpZrsectiontitle: '',
          }),
          this.server.create('affected-zoning-resolution', {
            dcpZoningresolutiontype: 'ZR',
            dcpZrsectionnumber: 'Appendix F',
            dcpZrsectiontitle: 'Inclusionary Housing Designated Areas and Mandatory Inclusionary Housing Areas',
          }),
        ],
        dcpIncludezoningtextamendment: true,
      }),
    });

    this.rwcdsPackage = await this.owner.lookup('service:store').findRecord('package', this.package.id, { include: 'rwcds-form,rwcds-form.affectedZoningResolutions' });

    // Template block usage:
    await render(hbs`
      <Packages::ProposedActions
        @rwcdsForm={{this.rwcdsPackage.rwcdsForm}}>
      </Packages::ProposedActions>
    `);

    await fillIn('[data-test-input="ZA"]', 'my section number');
    assert.equal(this.rwcdsPackage.rwcdsForm.affectedZoningResolutions.firstObject.dcpModifiedzrsectionnumber, 'my section number');

    await fillIn('[data-test-input="dcpPurposeandneedfortheproposedaction"]', 'my purpose and need');
    assert.equal(this.rwcdsPackage.rwcdsForm.dcpPurposeandneedfortheproposedaction, 'my purpose and need');

    await click('[data-test-radio="dcpIsplannigondevelopingaffordablehousing"][data-test-radio-option="Yes"]');
    assert.equal(this.rwcdsPackage.rwcdsForm.dcpIsplannigondevelopingaffordablehousing, true);

    await click('[data-test-radio="dcpIsapplicantseekingaction"][data-test-radio-option="Yes"]');
    assert.equal(this.rwcdsPackage.rwcdsForm.dcpIsapplicantseekingaction, 717170000);

    await fillIn('[data-test-input="dcpWhichactionsfromotheragenciesaresought"]', 'actions from agencies');
    assert.equal(this.rwcdsPackage.rwcdsForm.dcpWhichactionsfromotheragenciesaresought, 'actions from agencies');
  });
});

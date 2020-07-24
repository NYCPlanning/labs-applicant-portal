import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | project/package-list-item', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('displays package item correctly', async function(assert) {
    const packageDate = new Date(2018, 11, 24);

    this.server.create('package', 'pasForm', {
      id: '123',
      dcpPackagetype: 717170000,
      statuscode: 1,
      dcpPackageversion: 1,
      dcpVisibility: 717170002,
      dcpStatusdate: packageDate,
    });

    const store = this.owner.lookup('service:store');
    this.package = await store.findRecord('package', '123');

    await render(hbs`
      <Project::PackageListItem @package={{this.package}}>
      </Project::PackageListItem>
    `);

    assert.dom(this.element).includesText('Version 1');
    assert.dom(this.element).includesText('Editable');
    assert.dom(this.element).includesText('12/24/2018');
  });
});

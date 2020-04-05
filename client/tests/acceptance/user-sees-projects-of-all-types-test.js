import { module, test, skip } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user sees projects of all types', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Shows correct # of projects by type', async function(assert) {
    this.server.createList('project', 4, 'toDo');
    this.server.createList('project', 5, 'workingOnIt');

    await visit('/projects');

    assert.equal(findAll("[data-test-type='to-do']").length, 4);
    assert.equal(findAll("[data-test-type='working-on-it']").length, 5);
  });

  // this test is failing because empty-package projects don't appear
  test('Project shows up in the right "Working on it..." column with no button', async function (assert) {
    this.server.createList('project', 5, 'workingOnIt');
    this.server.createList('project', 3, 'noPackages');

    await visit('/projects');

    assert.equal(findAll("[data-test-type='working-on-it']").length, 8);
  });

  skip('Project shows up in the left "To DO" column with an "Edit Pre-Application Statement" button');

  skip('Project shows up in the right "Working on it..." column with a "View Pre-Application Statement" button');

  skip('Page should display non-assigned message if no projects');
});

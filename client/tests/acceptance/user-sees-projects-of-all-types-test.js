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

  skip('Project shows up in the bottom "Working on it..." section with no button', async function (assert) {
    await visit('/projects');
  });

  skip('Project shows up in the left "To DO" column with an "Edit Pre-Application Statement" button');

  skip('Project shows up in the right "Working on it..." column with a "View Pre-Application Statement" button');

  skip('Page should display non-assigned message if no projects');

  test('Page should honor creeper mode query param', async function(assert) {
    assert.expect(1);

    this.server.get('/projects', (schema, request) => {
      assert.equal(request.queryParams.email, 'someone@mail.com');

      return schema.projects.all();
    });

    await visit('/projects?email=someone@mail.com');
  });
});

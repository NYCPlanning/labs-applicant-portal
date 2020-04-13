import { module, test, skip } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | user sees projects of all types', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Shows correct # of projects by type', async function(assert) {
    this.server.createList('project', 4, 'applicant');
    this.server.createList('project', 5, 'planning');

    await visit('/projects');

    assert.equal(findAll("[data-test-type='to-do']").length, 4);
    assert.equal(findAll("[data-test-type='working-on-it']").length, 5);
  });

  test('Project shows up in the bottom with "Working on it..." with a button when appropriate', async function (assert) {
    this.server.createList('project', 3, 'planningNoViewPASButton');
    this.server.createList('project', 5, 'planningWithViewPASButton');

    await visit('/projects');

    assert.equal(findAll("[data-test-type='working-on-it']").length, 8);
    assert.equal(findAll('[data-test-view-pas]').length, 5);
  });

  skip('Page should display non-assigned message if no projects');

  test('Projects are listed alphabetically', async function (assert) {
    this.server.create('project', 'applicant', {
      dcpProjectname: 'Title Is C',
    });
    this.server.create('project', 'applicant', {
      dcpProjectname: 'Title Is A',
    });
    this.server.create('project', 'applicant', {
      dcpProjectname: 'Title Is B',
    });

    await visit('/projects');

    assert.ok(findAll("[data-test-type='to-do']")[0].textContent.includes('Title Is A'));
    assert.ok(findAll("[data-test-type='to-do']")[1].textContent.includes('Title Is B'));
    assert.ok(findAll("[data-test-type='to-do']")[2].textContent.includes('Title Is C'));
  });

  test('Page should honor creeper mode query param', async function(assert) {
    assert.expect(1);

    this.server.get('/projects', (schema, request) => {
      assert.equal(request.queryParams.email, 'someone@mail.com');

      return schema.projects.all();
    });

    await visit('/projects?email=someone@mail.com');
  });
});

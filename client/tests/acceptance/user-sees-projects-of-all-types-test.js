import { module, test } from 'qunit';
import { visit, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user sees projects of all types', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('Shows correct # of projects by type', async function(assert) {
    this.server.createList('project', 4, 'toDo');
    this.server.createList('project', 5, 'done');

    await visit('/projects');

    assert.equal(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]').length, 4);
    assert.equal(findAll('[data-test-projects-list="done"] [data-test-my-project-list-item]').length, 5);
  });

  test('Page should display "No response required" message if no applicant projects', async function(assert) {
    this.server.createList('project', 1, 'done');

    await visit('/projects');

    assert.ok(find('[data-test-no-response-required]'));
    assert.notOk(find('[data-test-not-assigned-any-active-project]'));
  });

  test('Page should display "Not assigned any active projects" message if no active projects whatsoever', async function(assert) {
    await visit('/projects');
    assert.ok(find('[data-test-not-assigned-any-active-project]'));
  });

  test('Projects are listed alphabetically', async function (assert) {
    this.server.create('project', 'toDo', {
      dcpProjectname: 'Title Is C',
    });
    this.server.create('project', 'toDo', {
      dcpProjectname: 'Title Is A',
    });
    this.server.create('project', 'toDo', {
      dcpProjectname: 'Title Is B',
    });
    this.server.create('project', 'toDo', {
      dcpProjectname: 'Title Is b', // check lower case
    });

    await visit('/projects');

    assert.ok(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]')[0].textContent.includes('Title Is A'));
    assert.ok(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]')[1].textContent.includes('Title Is b'));
    assert.ok(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]')[2].textContent.includes('Title Is B'));
    assert.ok(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]')[3].textContent.includes('Title Is C'));
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

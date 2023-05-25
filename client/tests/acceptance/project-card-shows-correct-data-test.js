import { module, test } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module(
  'Acceptance | my-projects sorts projects into two buckets',
  function (hooks) {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(() => {
      authenticateSession({
        emailaddress1: 'me@me.com',
      });
    });

    test('Shows projects in the right list', async function (assert) {
      // 4 to-do projects
      this.server.createList('project', 4, 'toDo');

      // 2 done projects
      this.server.createList('project', 2, 'done');

      await visit('/projects');

      // should have 4 projects in the done list
      assert.equal(
        findAll(
          '[data-test-projects-list="to-do"] [data-test-my-project-list-item]',
        ).length,
        4,
      );

      // should have 2 projects in the done list
      assert.equal(
        findAll(
          '[data-test-projects-list="done"] [data-test-my-project-list-item]',
        ).length,
        2,
      );
    });
  },
);

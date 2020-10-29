import { module, test } from 'qunit';
import {
  visit,
  click,
  findAll,
  currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | user can edit Filed EAS Packages', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    authenticateSession({
      emailaddress1: 'me@me.com',
    });
  });

  test('User sees Project under Awaiting Submission if it has an active Filed EAS', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
        this.server.create('package', 'done', 'filedEas'),
      ],
    });

    this.server.create('project', {
      packages: [
        this.server.create('package', 'done', 'filedEas'),
      ],
    });

    await visit('/projects');
    assert.equal(findAll('[data-test-projects-list="to-do"] [data-test-my-project-list-item]').length, 1);

    assert.equal(findAll('[data-test-projects-list="done"] [data-test-my-project-list-item]').length, 1);
  });

  test('User sees Filed EAS Packages section on Project page when one exists', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/projects/1');

    assert.dom('[data-test-package-section="Environmental Assessment Statement (EAS)"]').exists();

    assert.equal(findAll('[data-test-package-link]').length, 2);
  });

  test('User can click into Filed EAS and see Package info, Package notes, and Attachments', async function (assert) {
    this.server.create('project', {
      packages: [
        this.server.create('package', 'toDo', 'filedEas'),
      ],
    });

    await visit('/projects/1');

    await click('[data-test-package-link="1"]');

    assert.equal(currentURL(), '/filed-eas/1/edit');

    assert.dom('[data-test-package-dcpPackageversion]').hasText('(V1)');

    assert.dom('[data-test-project-dcpProjectname]').containsText('Huge New Public Library');

    assert.dom('[data-test-project-dcpName]').hasText('(P2018M0268)');

    assert.dom('[data-test-project-dcpBorough]').containsText('Bronx');

    assert.dom('[data-test-package-statuscode]').containsText('Package Preparation');

    assert.dom('[data-test-package-notes]').containsText('Some instructions from Planners');

    assert.dom('[data-test-attached-documents]').exists();
  });
});
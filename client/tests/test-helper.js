import Application from 'client/app';
import config from 'client/config/environment';
import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { start } from 'ember-qunit';
import { setup } from 'qunit-dom';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();

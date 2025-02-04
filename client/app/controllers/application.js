import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'client/config/environment';

export default class ApplicationController extends Controller {
  @tracked
  phishingWarningFlagOn = config.featureFlagPhishingWarning;

  queryParams = ['email', 'header'];

  header = true;

  @service session;
}

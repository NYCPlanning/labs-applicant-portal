import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'client/config/environment';

import SaveableRwcdsFormValidations from '../../../validations/saveable-rwcds-form';
import SaveableProjectFormValidations from '../../../validations/saveable-project-form';
import SaveableAffectedZoningResolutionFormValidations from '../../../validations/saveable-affected-zoning-resolution-form';

import SubmittableRwcdsFormValidations from '../../../validations/submittable-rwcds-form';
import SubmittableProjectFormValidations from '../../../validations/submittable-project-form';
import SubmittableAffectedZoningResolutionFormValidations from '../../../validations/submittable-affected-zoning-resolution-form';

const NOTIFICATIONBANNER_RANGE = ENV.notificationBannerTimes;

export default class PackagesRwcdsFormEditComponent extends Component {
  validations = {
    SaveableRwcdsFormValidations,
    SaveableProjectFormValidations,
    SaveableAffectedZoningResolutionFormValidations,
    SubmittableRwcdsFormValidations,
    SubmittableProjectFormValidations,
    SubmittableAffectedZoningResolutionFormValidations,
  };

  @service
  router;

  @tracked
  isBannerOpen = true;

  get rwcdsForm() {
    return this.args.package.rwcdsForm || {};
  }


  @action
  async savePackage() {
    try {
      await this.args.package.save();
    } catch (error) {
      console.log('Save RWCDS package error:', error);
    }
  }

  @action
  async submitPackage() {
    await this.args.package.submit();

    if (!this.rwcdsForm.adapterError && !this.args.package.adapterError && !this.args.package.fileUploadErrors) {
      this.router.transitionTo('rwcds-form.show', this.args.package.id);
    }
  }

  @action
  closeBanner() {
    this.isBannerOpen = false;
  }

  get isNotificationBannerPeriod() {
    const [start, end] = NOTIFICATIONBANNER_RANGE.map((string) => new Date(string));
    const now = new Date();

    return now > start && now < end;
  }
}

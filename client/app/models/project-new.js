import Model, { attr } from '@ember-data/model';

export default class ProjectNew extends Model {
  @attr('string', {
    defaultValue: ''
  })
  projectName;

  @attr('string', {
    defaultValue: ''
  })
  borough;

  @attr('string', {
    defaultValue: ''
  })
  applicantType;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactFirstName;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactLastName;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactEmail;

  @attr('string', {
    defaultValue: ''
  })
  primaryContactPhone;

  @attr('string', {
    defaultValue: ''
  })
  applicantFirstName;

  @attr('string', {
    defaultValue: ''
  })
  applicantLastName;

  @attr('string', {
    defaultValue: ''
  })
  applicantEmail;

  @attr('string', {
    defaultValue: ''
  })
  applicantPhone;

  @attr('string', {
    defaultValue: ''
  })
  projectBrief;
}

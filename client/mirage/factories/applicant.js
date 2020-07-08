import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  dcpFirstname: 'Brandyn',
  dcpLastname: 'Friedly',
  dcpEmail: 'bfriedly@planning.nyc.gov',
  dcpAddress: '120 Broadway',
  dcpCity: 'New York',
  dcpState: 1,
  dcpZipcode: '10014',
  dcpPhone: '2127203300',

  individualApplicant: trait({
    targetEntity: 'dcp_applicantinformation',
    dcpType: 717170000,
    dcpOrganization: null,
  }),
  organizationApplicant: trait({
    targetEntity: 'dcp_applicantinformation',
    dcpType: 717170001,
    dcpOrganization: 'Planning Labs',
  }),

  applicantTeamMember: trait({
    targetEntity: 'dcp_applicantrepresentativeinformation',
    dcpType: null,
    dcpOrganization: 'Vandelay Industries',
  }),
});

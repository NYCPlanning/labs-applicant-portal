let { CONTACT_MGMT_ENABLED = false } = process.env;

CONTACT_MGMT_ENABLED = JSON.parse(CONTACT_MGMT_ENABLED);

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    host: getHost(environment),
    NYCIDDomain: getOAuthDomain(environment),
    NYCIDLocation: getOAuthLoginEndpoint(environment),
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    fontawesome: {
      icons: {
        'free-brands-svg-icons': 'all',
        'free-regular-svg-icons': 'all',
        'free-solid-svg-icons': 'all',
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      contactMgmtEnabled: CONTACT_MGMT_ENABLED,
    },

    'labs-search': {
      host: 'https://search-api.planninglabs.nyc',
      route: 'search',
      helpers: ['geosearch', 'bbl'],
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.host = '';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.APP.contactMgmtEnabled = false;
  }

  return ENV;
};

function getHost(environment) {
  if (process.env.HOST) {
    return process.env.HOST;
  }

  if (environment === 'review') {
    return process.env.HOST_PR_REVIEW;
  }

  return '';
}

function getOAuthDomain(environment) {
  const { HOST } = process.env;

  // plain local development, no local backing server
  if (environment === 'development' && !HOST) {
    return 'http://localhost:4200';
  }

  // if we're running locally and a HOST is provided
  if (environment === 'development' && HOST) {
    return 'https://accounts-nonprd.nyc.gov';
  }

  if (environment === 'production') {
    return 'https://accounts-nonprd.nyc.gov';
  }

  if (environment === 'test') {
    return '';
  }

  return '';
}

function getOAuthLoginEndpoint(environment) {
  const { NYCID_CLIENT_ID, HOST } = process.env;

  const DOMAIN = getOAuthDomain(environment);

  // plain local development, no local backing server
  if (environment === 'development' && !HOST) {
    return `${DOMAIN}/login#access_token=test`;
  }

  // if we're running locally and a HOST is provided
  if (environment === 'development' && HOST) {
    const NYCID_CLIENT_ID_LOCAL = 'applicant-portal-local';

    return `${DOMAIN}/account/api/oauth/authorize.htm?response_type=token&client_id=${NYCID_CLIENT_ID_LOCAL}`;
  }

  if (environment === 'production') {
    return `${DOMAIN}/account/api/oauth/authorize.htm?response_type=token&client_id=${NYCID_CLIENT_ID}`;
  }

  if (environment === 'test') {
    return '';
  }

  return '';
}

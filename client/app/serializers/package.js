import ApplicationSerializer from './application';

export default class PackageSerializer extends ApplicationSerializer {
  attrs = {
    pasForm: { serialize: true },
  };
}

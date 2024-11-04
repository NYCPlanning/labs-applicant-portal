import JSONAPISerializer from '@ember-data/serializer/json-api';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default JSONAPISerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    projectApplicants: { embedded: 'always' },
  },
});

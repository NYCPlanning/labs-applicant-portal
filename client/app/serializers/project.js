import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import JSONAPISerializer from "@ember-data/serializer/json-api";
 
export default JSONAPISerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    projectApplicants: { embedded: "always" },
  },
});

import Transform from '@ember-data/serializer/transform';

export default class YearTransform extends Transform {
  deserialize(serialized) {
    return new Date(serialized).getFullYear(); // returns year
  }

  serialize(deserialized) {
    return new Date(deserialized, 0); // returns date
  }
}

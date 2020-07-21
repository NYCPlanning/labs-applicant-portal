export function addToHasMany(changeset, relationship, item) {
  let hasMany = changeset.get(relationship).pushObjects([item]);
  changeset.set(relationship, hasMany.toArray());
}

export function removeFromHasMany(changeset, relationship, item) {
  let hasMany = changeset.get(relationship).removeObject(item);
  changeset.set(relationship, hasMany.toArray());
}

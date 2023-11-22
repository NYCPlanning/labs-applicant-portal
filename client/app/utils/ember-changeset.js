export function addToHasMany(changeset, relationship, item) {
  const hasMany = changeset.get(relationship).pushObjects([item]);
  console.log("hasMany", hasMany ? hasMany : "no hasMany for changeset to add");
  changeset.set(relationship, hasMany.toArray());
}

export function removeFromHasMany(changeset, relationship, item) {
  const hasMany = changeset.get(relationship).removeObject(item);
  console.log("hasMany", hasMany ? hasMany : "no hasMany for changeset to remove");
  changeset.set(relationship, hasMany.toArray());
}

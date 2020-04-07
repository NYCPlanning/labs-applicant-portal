const COMMUNITY_DISPLAY_TOKEN = '@OData.Community.Display.V1.FormattedValue';

// CRM provides numeric codes for picklist types
// for example, "yes" might appear as "1"
// This function maps those values with appropriate labels
export function overwriteCodesWithLabels(records, targetFields) {
  return records.map(record => {
    const newRecord = record;

    // parent record
    Object.keys(record)
      .filter(key => key.includes('_formatted'))
      .map(key => key.replace('_formatted', ''))
      .forEach(key => {
        if (targetFields.includes(key)) {
          newRecord[key] = record[`${key}_formatted`];
        }
      });

    // child records
    // etag here is used to filter for entities
    // we need keys whos values are arrays
    const values = Object.entries(record)
      .filter(([, value]) => Array.isArray(value))
      .forEach(([, collection]) => {

        collection
          // @ts-ignore
          .filter(Boolean)
          .map(record => {
            const newRecord = record;

            Object.keys(record)
              .filter(key => key.includes(COMMUNITY_DISPLAY_TOKEN))
              .map(key => key.replace(COMMUNITY_DISPLAY_TOKEN, ''))
              .forEach(key => {
                if (targetFields.includes(key)) {
                  newRecord[key] = record[`${key}${COMMUNITY_DISPLAY_TOKEN}`];
                }
              });
          });
      });

    return newRecord;
  });
}

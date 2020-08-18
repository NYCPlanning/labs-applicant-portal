## Helpers

## optionset

A helper to standardize retrieving optionsets and their labels and codes.

Use:
```
{{optionset <model> <optionsetId> <returnType> <lookupToken>}}
```

See [./optionset.js](./optionset.js) for details on the parameters.

The examples below illustrate the six different uses of the helper.

**{{optionset 'package' 'statuscode'}}** --> returns the optionset object
```js
    {
      UNDER_REVIEW: {
        code: 717170013,
        label: 'Under Review',
      },
      REVIEWED_NO_REVISIONS_REQUIRED: {
        code: 717170009,
        label: 'Reviewed - No Revisions Required',
      },
      ...
    } 
```

**{{optionset 'package' 'statuscode' 'list'}}** --> returns an array of the optionset's options
```js
    [
      {
        code: 717170013,
        label: 'Under Review',
      },
      {
        code: 717170009,
        label: 'Reviewed - No Revisions Required',
      },
      ...
    ] 
```

**{{optionset 'package' 'statuscode' 'label' 717170013}}** --> returns label for given code 
```
'Under Review'
```

**{{optionset 'package' 'statuscode' 'label' 'UNDER_REVIEW'}}** --> returns label for given identifier 
```
'Under Review'
```

**{{optionset 'package' 'statuscode' 'code' 'Under Review'}}** --> returns code for given label
```
717170013
```

**{{optionset 'package' 'statuscode' 'code' 'UNDER_REVIEW'}}** --> returns label for given identifier 
```
717170013
```

# query-search
Searches in array by query and returns array of matches

## Usage

```npm install query-search```

```javascript
var querySearch = require('query-search');

var query = {
    someProp: 10 // Will search for a objects with 'someProp' equal to 10
};

var schema = {
    someProp: true // Will say querySearch to ignore all props except 'someProp'
};

var collection = [
    {
        someProp: 3 // Doesn't match
    },

    {
        someOtherProp: 10 // Doesn't match
    },
    
    {
        someProp: 10 // Match!
    }
];

querySearch(query, schema, collection) // returns new array [{someProp: 10}]
```

## Deep search

```javascript
var querySearch = require('query-search');

var query = {
    some: {
        nested: {
            property: { // Deeeeeep
                a: 5,
                b: 3
            }
        }
    }
};

var schema = {
    some: {
        nested: {
            property: true // Saying to compare objects (uses lodash.isEqual)
        }
    }
};

var collection = [
    {some: {nested: {property: { // property - is object, so we need to compare it's values and not the refs
        a: 2,
        b: 3
    }}}},

    {some: {nested: {property: {
        a: 5,
        b: 2
    }}}},

    {some: {nested: {property: { // Props order doesn't metter
        b: 3,
        a: 5
    }}}},

    {some: {nested: {property: {
        a: 5,
        b: 3
    }}}}
];

querySearch(query, schema, collection) // returns new array [{some: {nested: {property: {b: 3, a: 5}}}}, {some: {nested: {property: {a: 5, b: 3}}}}]
```
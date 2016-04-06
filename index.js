'use strict';

var isObject = require('lodash.isobject');
var isEqual = require('lodash.isequal');

/**
 *
 * @param query {Object} query to search for
 * @param schema {Object} schema of non-ignored properties
 * @param collection {Array} to search in
 * @returns {Array} of matched items
 */
module.exports = function(query, schema, collection) {
    var ret = [];

    rec(query, schema, collection, ret, null);

    return ret;
};

/**
 *
 * @param query {Object} query to search for
 * @param schema {Object} schema of non-ignored properties
 * @param collection {Array} to search in
 * @param match {Array} to push in
 * @param deepKeys {Array} deep inner keys
 */
function rec(query, schema, collection, match, deepKeys) {
    var levels = deepKeys && deepKeys.length;

    Object.keys(schema).forEach(function(schemaKey) {
        if (levels) {
            deepKeys.push(schemaKey);
        }

        Object.keys(query).forEach(function(queryKey) {
            if (schema[queryKey]) {
                match.push.apply(match, collection.filter(function(value) {
                    var compare = value;

                    // There is already matched current value
                    if (match.indexOf(value) !== -1) {
                        return false;
                    }

                    compare = getCompareble(levels, deepKeys, schemaKey, compare);

                    if (!compare) {
                        return false;
                    }

                    if (isObject(compare)) {
                        return isEqual(compare, query[queryKey]);
                    }

                    return compare.toString().toLowerCase().indexOf(query[queryKey].toString().toLowerCase()) > -1;
                }));

                return rec(query[queryKey], schema[schemaKey], collection, match, deepKeys || [schemaKey]);
            }
        });
    });
}

/**
 *
 * @param levels {Boolean}
 * @param deepKeys {Array}
 * @param schemaKey
 * @param compare
 * @returns {*}
 */
function getCompareble(levels, deepKeys, schemaKey, compare) {
    if (levels) {
        deepKeys.forEach(function(innerKey) {
            compare = compare[innerKey];
        });
    } else {
        compare = compare[schemaKey];
    }

    return compare;
}
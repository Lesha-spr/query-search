'use strict';

var objectSort = require('object-sort');
var isObject = require('lodash.isobject');

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
 * @param key {String} deep inner key
 */
function rec(query, schema, collection, match, key) {
    // FIXME: refactor
    Object.keys(schema).forEach(function(schemaKey) {
        if (key) {
            key = key + '.' + schemaKey;
        }

        Object.keys(query).forEach(function(queryKey) {
            if (schema[queryKey]) {
                match.push.apply(match, collection.filter(function(value) {
                    var compare = value;

                    if (match.indexOf(value) === -1) {
                        if (key) {
                            key.split('.').forEach(function(innerKey) {
                                compare = compare[innerKey];
                            });
                        } else {
                            compare = compare[schemaKey];
                        }

                        if (isObject(compare)) {
                            return JSON.stringify(objectSort(compare)) === JSON.stringify(objectSort(query[queryKey]));
                        }

                        return compare.toString().toLowerCase().indexOf(query[queryKey].toString().toLowerCase()) > -1;
                    }

                    return false;
                }));

                return rec(query[queryKey], schema[schemaKey], collection, match, key || schemaKey);
            }
        });
    });
}
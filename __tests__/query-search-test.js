'use strict';

jest.unmock('./../index.js');

const querySearch = require('./../index.js');

var query, schema, collection, result;

describe('query-search', function() {
    it('should return empty array if not found matches', function() {
        query = {
            a: 5,
            b: 3
        };

        schema = {
            a: true
        };

        collection = [
            {
                a: 1
            },

            {
                a: 3,
                b: false
            },

            {
                b: 4,
                a: false
            }
        ];

        result = querySearch(query, schema, collection);

        expect(querySearch(query, schema, collection)).toEqual([]);
    });

    it('should return matched array on schema without nesting', function() {
        query = {
            a: 5,
            b: 3
        };

        schema = {
            a: true
        };

        collection = [
            {
                a: 1
            },

            {
                a: 5,
                b: false
            },

            {
                b: 3,
                a: false
            }
        ];

        result = querySearch(query, schema, collection);

        expect(result).toEqual([{a: 5, b: false}]);
    });

    it('should return matched array on nested schema', function() {
        query = {some: {nested: {property: {
            a: 5,
            b: 3
        }}}};
        schema = {some: {nested: {property: true}}};
        collection = [
            {some: {nested: {property: {
                a: 2,
                b: 3
            }}}},

            {some: {nested: {property: {
                a: 5,
                b: 2
            }}}},

            {some: {nested: {property: {
                b: 3,
                a: 5
            }}}},

            {some: {nested: {property: {
                a: 5,
                b: 3
            }}}}
        ];

        result = querySearch(query, schema, collection);

        expect(result).toEqual([
            {some: {nested: {property: {
                b: 3,
                a: 5
            }}}},

            {some: {nested: {property: {
                a: 5,
                b: 3
            }}}}
        ]);
    });
});
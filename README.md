backlunr
===========

is a solution to bring [Backbone Collections](http://documentcloud.github.com/backbone/#Collection) together with the browser fulltext search engine [Lunr.js](http://lunrjs.com/).



## Install

To use **backlunr** you first have to load the dependencies:
- [Underscore](http://documentcloud.github.com/underscore)
- [Backbone](http://documentcloud.github.com/backbone)
- [Cocktail](https://github.com/onsi/cocktail)
- [Lunr.js](http://lunrjs.com/)

Then add the `backlunr.mixin.js` script to your page.

## Usage

### Config

To use the `lunr.js` fulltext search within a collection you have to load `backlunr.js` and use either `Backbone.Collection.Lunr` instead of `Backbone.Collection`.
If you want to use the mixin instead of the new base collection, just add the mixin with Cocktail as in 'backlunr.collection.js'

The only thing you have to define are the fields to index.

**Config Example:**

```js
var User = Backbone.Model.extend();

var Users = Backbone.Collection.extend({
    model: User,
    lunroptions: {
        fields: [
            { name: "firstname", boost: 10 },
            { name: "lastname", boost: 5 },
            { name: "email" },
            { name: "address" }
        ]
    }
});
Cocktail.mixin(Users, Backbone.LunrMixin);
```

#### lunroptions

* `fields` ( Array | Function ): An array of field definitions or a method called on init/reset which has to return the field definitions array
* `fields[ n ]` ( Object ): The field definition
* `fields[ n ].name` ( String - required ): The field name within your model attribute
* `fields[ n ].boost` ( Number - optional: default=1 ): A boost factor for results in this field.

**Attension:** Currently Lunr.js does not support an indexing of numeric values. To use numeric values **backlunr** converts all fields to strings.

### search

To search within your collection you just have to call `.search( "[ term ]" )`.

**Search Example:**

```js
// add some users
var usersCollection = new Users([
    { firstname: "Fritz", lastname: "Maier", "email": "fmaier@maier.com", "address": "Teststreet 123" },
    { firstname: "Hans", lastname: "Schubert", "email": "hschubert@maier.com", "address": "Checkway 987" }
]);

var result = usersCollection.search("Fritz");
// [ User( Fritz ) ]
// returns an array of matching models sorted by the result scoring

result.toJSON();
// [ {firstname: "Fritz", lastname: "Maier", "email": "fmaier@maier.com", "address": "Teststreet 123"} ]
// the single special method `toJSON` of the array returns all models converted by `model.toJSON()`.
```

### Methods

#### Collection.search( term [, raw ] )

`.search()` is the only method added to the collection by **Backlunr**.

**arguments:**

* `term` ( String - required ): the search term
* `raw` ( Boolean - optional: default=false ): Return the raw lunr result including the `score` and models `cid` as `ref`

**retuns ( Array ):**

An array of matching models.  
If you define `raw=true` you will receive an array with object like `{ score: 0.789, ref: "c123" }`

* `toJSON()` If `raw=false` you can use the special `toJSON` method to transform the aray of models to an array of model attributes.

## Ideas

* Create a solution to search in multiple collections by hooking them to a global search module. If a search has been done the result will return all matching models in al hooked collection including the type ( Collection name )

## Work in progress

`backlunr` is work in progress. Your ideas, suggestions etc. are very welcome.

## Changelog

#### `0.3`

* Ported from CoffeeScript to JavaScript to add mixin functionality

#### `0.2.1`

* Updated test to Lunr.js `v0.4.0`, jquery `v2.0.3`, mocha `v0.2.0` and expect `v1.12.0`. **Backlunr test already working fine** but 15% faster.
* Compiled scripts with new coffee version `v1.6.3`

#### `0.2.0`

* Added minified version
* Added support for numeric values by converting every field-value to a string

#### `0.1.0`

* Initial version

## License 

(The MIT License)

Copyright (c) 2010 TCS &lt;dev (at) tcs.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

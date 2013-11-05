var path = require('path'),
    assert = require('assert'),
    transform = require('./index')
    dgraph = require('dgraph'),
    aggregate = require('stream-aggregate-promise'),
    asStream = require('as-stream')

var ok = assert.ok,
    equal = assert.equal

function fixture(name) {
  return path.join(__dirname, 'fixtures', name)
}

describe('dgraph-css-import', function() {

  it('extracts css imports', function(done) {
    var entry = fixture('main.css')
    aggregate(dgraph(entry, {transform: transform})).then(function(graph) {
      equal(graph.length, 3)

      var index = {}
      graph.forEach(function(n) { index[n.id] = n})

      var main = index[fixture('main.css')],
          button = index[fixture('button.css')],
          icons = index[fixture('icons.css')]

      ok(main)
      ok(main.deps)
      ok(main.style)
      ok(main.deps['./button.css'])
      equal(main.deps['./button.css'], fixture('button.css'))

      ok(button)
      ok(button.deps)
      ok(button.style)
      ok(button.deps['./icons.css'])
      equal(button.deps['./icons.css'], fixture('icons.css'))

      ok(icons)
      ok(icons.style)
      ok(icons.deps)
    }).then(done, done);
  });

  it('automatically considers files with no extensions as .css', function(done) {
    var entry = fixture('no-ext.css')
    aggregate(dgraph(entry, {transform: transform})).then(function(graph) {
      equal(graph.length, 3)

      var index = {}
      graph.forEach(function(n) { index[n.id] = n})

      var main = index[fixture('no-ext.css')],
          button = index[fixture('button.css')],
          icons = index[fixture('icons.css')]

      ok(main)
      ok(main.deps)
      ok(main.style)
      ok(main.deps['./button'])
      equal(main.deps['./button'], fixture('button.css'))

      ok(button)
      ok(button.deps)
      ok(button.style)
      ok(button.deps['./icons.css'])
      equal(button.deps['./icons.css'], fixture('icons.css'))

      ok(icons)
      ok(icons.style)
      ok(icons.deps)
    }).then(done, done);
  });

})

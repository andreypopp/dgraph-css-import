var path = require('path'),
    assert = require('assert'),
    transform = require('./index')
    dgraph = require('dgraph'),
    aggregate = require('stream-aggregate'),
    asStream = require('as-stream')

var ok = assert.ok,
    equal = assert.equal

function fixture(name) {
  return path.join(__dirname, 'fixtures', name)
}

describe('dgraph-css-import', function() {

  it('extracts css imports', function(done) {
    var entry = fixture('main.css')
    aggregate(dgraph(entry, {transform: transform}), function(err, graph) {
      if (err) return done(err)

      equal(graph.length, 3)

      var index = {}
      graph.forEach(function(n) { index[n.id] = n})

      var main = index[fixture('main.css')],
          button = index[fixture('button.css')],
          icons = index[fixture('icons.css')]

      ok(main)
      ok(main.deps)
      ok(main.tree)
      ok(main.deps['./button.css'])
      equal(main.deps['./button.css'], fixture('button.css'))

      ok(button)
      ok(button.deps)
      ok(button.tree)
      ok(button.deps['./icons.css'])
      equal(button.deps['./icons.css'], fixture('icons.css'))

      ok(icons)
      ok(icons.tree)
      ok(icons.deps)

      done()
    })
  })

})

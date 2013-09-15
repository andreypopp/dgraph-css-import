var path = require('path'),
    assert = require('assert'),
    transform = require('./index')
    dgraph = require('dgraph'),
    aggregate = require('stream-aggregate'),
    asStream = require('as-stream')

function fixture(name) {
  return path.join(__dirname, 'fixtures', name)
}

describe('dgraph-css-import', function() {

  it('extracts css imports', function(done) {
    var entry = fixture('main.css')
    aggregate(dgraph(entry, {transform: transform}), function(err, graph) {
      if (err) return done(err)

      assert.equal(graph.length, 3)

      var index = {}
      graph.forEach(function(n) { index[n.id] = n})

      var main = index[fixture('main.css')],
          button = index[fixture('button.css')],
          icons = index[fixture('icons.css')]

      assert.ok(main)
      assert.ok(main.deps['./button.css'])
      assert.equal(main.deps['./button.css'], fixture('button.css'))

      assert.ok(button)
      assert.ok(button.deps['./icons.css'])
      assert.equal(button.deps['./icons.css'], fixture('icons.css'))

      assert.ok(icons)

      done()
    })
  })
  
})

"use strict";

var parse = require('css-parse')

module.exports = function(mod, g) {
  if (!/.*\.(css|styl|sass|scss|less)$/.exec(mod.id)) return

  var css = parse(mod.source.toString()),
      deps = []

  css.stylesheet.rules
    .filter(isImportRule)
    .forEach(function(r) {
      var dep = unquote(r.import)
      if (deps.indexOf(dep) === -1) deps.push(dep)
    })

  return g.resolveDeps(deps, mod)
    .then(function(deps) { return {deps: deps} })
}

function isImportRule(r) {
  return (r.type === 'import') && (!/^url\(/.exec(r.import))
}

function unquote(str) {
  return str.replace(/^['"]/, '').replace(/['"]$/, '')
}

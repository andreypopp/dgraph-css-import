"use strict";

var parse = require('css-parse')

module.exports = function(mod, g) {
  if (!/.*\.(css|styl|sass|scss|less)$/.exec(mod.id)) return

  var src = mod.source.toString();
  var style = parse(src, {position: true, source: mod.id});
  var deps = [];

  style.stylesheet.rules
    .filter(isImportRule)
    .forEach(function(r) {
      var dep = unquote(r.import)
      if (deps.indexOf(dep) === -1) deps.push(dep)
    })

  var parent = Object.create(mod);

  parent.extensions = ['.css'].concat(g.extensions);
  parent.packageFilter = function(pkg) {
    var shimmed = {};

    for (var k in pkg)
      shimmed[k] = pkg[k];

    if (shimmed.style)
      shimmed.browser = shimmed.style;

    return shimmed;
  };

  return g.resolveMany(deps, parent)
    .then(function(deps) { return {deps: deps, style: style} })
}

function isImportRule(r) {
  return (r.type === 'import') && (!/^url\(/.exec(r.import))
}

function unquote(str) {
  return str.replace(/^['"]/, '').replace(/['"]$/, '')
}

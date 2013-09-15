# dgraph-css-import

Transform for `dgraph` which extract dependencies from CSS by analyzing its
`@import` declarations and then resolving it using Node module resolving
mechanism. Can be used along with `css-pack` to produce bundles of CSS files
along with dependencies.

    % npm install dgraph-css-import dgraph css-pack deps-sort
    % dgraph --transform dgraph-css-import ./main.css \
        | deps-sort
        | css-pack
        > ./bundle.css

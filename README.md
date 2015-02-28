Leaf.js
=======

Working on a simple JavaScript library.


### Usage:

#### Hash Router

```js
// example.com
Leaf.Router.add('/', function() {});

// example.com/#!/about
Leaf.Router.add('/about', function() {});

// example.com/#!/post/123
Leaf.Router.add('/post/:postId', function(postId) {});

// 404
Leaf.Router.setNotFound(function(hash) {});

Leaf.Router.run();
```

#### Ajax

```js
Leaf.ajax({
  url    : '',
  method : 'GET|POST',
  data   : {k1: v2, k2: v2},
  success: function(data) {},
  fail   : function(event) {},
  finish : function(event) {}
});
```

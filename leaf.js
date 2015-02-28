/*
    Leaf.js, a simple JS lib.
    - Router
    - ajax
*/
(function() {

    this.Leaf = {};

    Leaf.version = '0.0.1';

    /*
        Router module usage

        // example.com
        Leaf.Router.add('/', function() {});
        // example.com/#!/about
        Leaf.Router.add('/about', function() {});
        // example.com/#!/post/123
        Leaf.Router.add('/post/:postId', function(postId) {});
        // 404
        Leaf.Router.setNotFound(function(hash) {});
        Leaf.Router.run();
    */
    Leaf.Router = {

        _routes: [],

        notFoundHandler: null,

        run: function() {
            window.onhashchange = function() {
                Leaf.Router.checkUrl();
            }
            this.checkUrl();
        },

        checkUrl: function() {

            var hash = Leaf.Router.clean(location.hash);

            for (var i = Leaf.Router._routes.length - 1, route, result; i >= 0; i--) {
                route = Leaf.Router._routes[i];
                result = hash.match(route.reg);
                if (!!result) {
                    result.length > 1 && result.shift();
                    route.callback.apply(Leaf.Router, result);
                    return;
                }
            }

            // not found
            !!Leaf.Router.notFoundHandler &&
                Leaf.Router.notFoundHandler(location.hash);
        },

        add: function(hash, callback) {
            var reg;

            if (hash === '/' || hash === '#!' || hash === '#!/') {
                hash = '';
                reg = new RegExp('^$');
            } else {
                hash = this.clean(hash);
                reg = new RegExp('^' + hash.replace(/\/:([^\/]+)/g, '\/([^/]*)') + '$');
            }

            this._routes.push({
                hash: hash,
                reg: reg,
                callback: callback
            });
            return this;
        },

        setNotFound: function(callback) {
            this.notFoundHandler = callback;
        },

        clean: function(str) {
            return str.replace(/^\/*/, '').replace(/\/*$/, '').replace(/^#\!\/*/g, '');
        }
    };

    /*
        Ajax module

        Leaf.ajax({
          url    : '',
          method : 'GET|POST',
          data   : {k1: v2, k2: v2},
          success: function(data) {},
          fail   : function(event) {},
          finish : function(event) {}
        });
    */
    Leaf.ajax = function(options) {
        // don't care IE6: ActiveXObject('Microsoft.XMLHTTP')
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(e) {
            var completed = 4;

            if (xhr.readyState === completed) {

                if (xhr.status === 200) { // ok
                    !!(options.success) && options.success(xhr.responseText);
                } else { // err
                    !!(options.fail) && options.fail(e);
                }

                !!(options.finish) && options.finish(e);
            }
        };

        options.data = options.method.toLowerCase === 'post' ? this.ajax.obj2str(options.data) : null;
        xhr.open(options.method, options.url, true);
        xhr.send(options.data);
    };

    // {a:1,b:2} -> a=1&b=2
    Leaf.ajax.obj2str = function(data) {
        var result = '';
        for (var k in data) {
            result += k + '=' + data[k] + '&';
        }
        result = result.slice(0, result.length - 1);
    }
})();

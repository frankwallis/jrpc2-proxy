# jrpc2-proxy

Auto-generate client-side proxy objects and functions for [jrpc2](https://github.com/Santinell/jrpc2)

[![build status](https://secure.travis-ci.org/frankwallis/jrpc2-proxy.png?branch=master)](http://travis-ci.org/frankwallis/jrpc2-proxy)

## Examples

### Services

```
	var rpc = require('jrpc2');
	var proxy = require("jrpc2-proxy");
	var AjaxTransport = require("jrpc2-ajax");
	
	var transport = new AjaxTransport({path: "/api/"});
	var client = new rpc.Client(transport);
	var userService = proxy.createService(client, ["fetchUsers", "getUser"]);

	userService.fetchUsers()
		.then(...);

	userService.fetchUsers(function(err, users) {
			...
		});

	userService.getUser(id)
		.then(...)

	userService.getUser(id, function(err, user) {
			...
		})
```


### Functions

```
	var loadPosts = proxy.createFunction(client, "loadPosts");
	loadPosts(queryParams).then(...etc);
```

## TODO

- Support ES6 proxies
- Create proxy from remote schema

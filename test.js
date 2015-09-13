var rpc = require('jrpc2');
var koa = require('koa');
var koaJrpc = require("koa-jrpc2");
var expect = require('chai').expect;

var proxy = require('./');

var app = koa();
var rpcServer = new rpc.Server();
app.use(koaJrpc(rpcServer));
app.listen(8081);

describe('Proxy', function() {

	it('creates a working service', function(done) {
		rpcServer.expose('sum', function(a, b) {
			return a + b;
		});

		var transport = new rpc.httpTransport({port: 8081, hostname: 'localhost'});
		var client = new rpc.Client(transport);
		var service = proxy.createService(client, ["sum"]);

		service.sum(5, 17)
			.then(function(total) {
				expect(total).to.equal(22);
				done();
			})
			.catch(done);
	});

	it('supports callback api', function(done) {
		rpcServer.expose('sum', function(a, b) {
			return a + b;
		});

		// in the browser you can just use path: "/api/" if connecting to window.location
		var transport = new rpc.httpTransport({port: 8081, hostname: 'localhost'});
		var client = new rpc.Client(transport);
		var service = proxy.createService(client, ["sum"]);

		service.sum(5, 17, function(err, total) {
				expect(total).to.equal(22);
				done();
			});
	});

	it('returns errors', function(done) {
		rpcServer.expose('sum', function(a, b) {
			if (arguments.length < 2)
				return Promise.reject(new Error("invalid arguments"));
			else
				return Promise.resolve(a + b);
		});

		// in the browser you can just use path: "/api/" if connecting to window.location
		var transport = new rpc.httpTransport({port: 8081, hostname: 'localhost'});
		var client = new rpc.Client(transport);
		var service = proxy.createService(client, ["sum"]);

		service.sum(5)
			.then(function(total, err) {
				expect(err.message).to.equal("invalid arguments");
				if (err) done();
				else done("this should error");
			})
			.catch(function(err) {
				expect(err.message).to.equal("invalid arguments");
				done();
			});
	});

});

function createFunction(client, funcName) {
	return function() {
		var args = [].slice.call(arguments);

		if( typeof args[args.length -1] === "function" ) {
			var callback = args[args.length -1];
			
			client.invoke(funcName, args, function (err, raw) {
				if (err) callback(err, null);
				else {
					if (typeof raw === "string")
						raw = JSON.parse(raw);
					if (raw.error) callback(raw.error, null);
					else callback(null, raw.result);
				}
	  		});
		}
		else if (global.Promise) {
			return new global.Promise(function(resolve, reject) {
				client.invoke(funcName, args, function (err, raw) {
					if (err) reject(err);
					else {
						if (typeof raw === "string")
							raw = JSON.parse(raw);
						if (raw.error) reject(raw.error);
						else resolve(raw.result);
					}
  				});
			});
		}
		else {
			throw new Error("no callback specified or global.Promise available")
		}
	}
}

function createService(client, funcNames) {
	if (!Array.isArray(funcNames))
		funcNames = [funcNames];

	return funcNames.reduce(function(result, funcName) {
		result[funcName] = createFunction(client, funcName);
		return result;
	}, {});
}

module.exports.createFunction = createFunction;
module.exports.createService = createService;

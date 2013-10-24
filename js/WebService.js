define(['underscore'], function (_) {
	var webService = {
		init: function (serializer, factory, methodLibrary, typeLibrary) {
			this.serializer = serializer;
			this.factory = factory;
			this.methodLibrary = methodLibrary;
			this.typeLibrary = typeLibrary;
			return this;
		},
		call: function (method, requestObj, onSuccess, onError) {
			var methodDef = this.methodLibrary.getItem(method);
			var serializedRequestObj = this.serializer.serialize(requestObj);

			//make a call using methodDef.endpoint and the callback functions
		}
	};

	return function WebService () {
		var obj = Object.create(webService, {
			constructor: { value: WebService }
		});
		return obj.init.apply(obj, arguments);
	};
});
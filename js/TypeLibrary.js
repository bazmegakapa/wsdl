define(['underscore', 'objTools', 'Library', 'wsdl/TypeDefinition'],
function (_, objTools, Library, TypeDefinition) {
	var capitalizeFirst = function (s) {
		return s[0].toUpperCase() + s.slice(1);
	};

	var typeLibrary = objTools.make(Library, 
		/**
		 * @lends TypeLibrary.prototype
		 */
		{
			/**
			 * @constructor TypeLibrary
			 * @classdesc Stores TypeDefinition objects and provides type-related utilities for objects created based on the types stored.
			 * @extends external:Library
			 * @param {TypeDefinition[]} defs - An array of type definition objects to store initially.
			 */
			init: function (defs) {
				this.items = {};
				this.type = TypeDefinition;
				this.nameProperty = 'type';
				this.addItems(defs);
				/**
				 * The type ensurer to be used when setting values.
				 * @member {TypeEnsurer} TypeLibrary#typeEnsurer
				 */
				this.typeEnsurer = null;
				return this;
			},
			/**
			 * Decides an object's type based on a classify() method defined on the object.
			 * @param {Object} obj - The object to get the type of.
			 * @returns {string} - The type of the object as returned from classify().
			 */
			getObjectType: function (obj) {
				if (!_(obj).isObject()) {
					return null;
				}
				if ('classify' in obj) {
					return obj.classify();
				}
				return 'Object';
			},
			/**
			 * Returns the value strategy used by the object.
			 * @see TypeDefinition#valueStrategy
			 * @param {Object} obj - The object to get the value strategy of.
			 * @returns {string|Function} - The value strategy for the given object.
			 * @protected
			 */		
			getValueStrategy: function (obj) {
				var typeObj = this.getItem(this.getObjectType(obj));
				return typeObj.valueStrategy;
			},
			/**
			 * Gets the value of the given property from the given object with the value strategy defined for the type of the object.
			 * @param {Object} obj - The object whose property we need.
			 * @param {string} key - The name of the property.
			 * @returns {string} - The type of the object as returned from classify().
			 */
			getValue: function (obj, key) {
				var s = this.getValueStrategy(obj);
				if (_(s).isObject() && _(s.get).isFunction()) {
					return s.get(obj, key);
				}
				var ret;
				switch (s) {
					case 'gettersetter':
						ret = obj['get' + capitalizeFirst(key)]();
					break;
					case 'property':
						ret = obj[key];
					break;
					default:
						ret = obj[key];
				}
				return ret;
			},
			/**
			 * Sets the value of the given property from the given object to the given value with the value strategy defined for the type of the object.
			 * Utilizes TypeEnsurer if set.
			 * @param {Object} obj - The object whose property we want to set.
			 * @param {string} key - The name of the property.
			 * @param {*} value - The new value for the property.
			 * @returns {string} - The type of the object as returned from classify().
			 */
			setValue: function (obj, key, value) {
				if (this.typeEnsurer) {
					value = this.typeEnsurer.ensureProperty(obj, key, value);
				}

				var s = this.getValueStrategy(obj);
				if (_(s).isObject() && _(s.set).isFunction()) {
					s.set(obj, key, value);
				}
				else {
					switch (s) {
						case 'gettersetter':
							obj['set' + capitalizeFirst(key)](value);
						break;
						case 'property':
							obj[key] = value;
						break;
						default:
							obj[key] = value;
					}
				}
			}
	});

	return objTools.makeConstructor(function TypeLibrary () {}, typeLibrary);

});
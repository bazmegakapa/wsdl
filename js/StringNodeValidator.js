define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/AnySimpleTypeNodeValidator',
	 'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, AnySimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var stringNodeValidator = objTools.make(AnySimpleTypeNodeValidator, {
		getDefaultFacets: function () {
			return {
				whiteSpace: 'preserve',
				pattern: '[a-z]+'
			};
		},
		getAllowedFacets: function () {
			return [
				'whiteSpace', 
				'length', 
				'minLength', 
				'maxLength', 
				'pattern', 
				'enumeration', 
				'assertions'
			];
		},
		validate: function () {
			var facets = {};
			//MISSING: need to handle inheritance/restriction!
			return this.validateFacets(facets);
		},
		validateMaxLength: function (facetValue) {
			return this.getValue().length <= facetValue;
		},
		validateMinLength: function (facetValue) {
			return this.getValue().length >= facetValue;
		},
		validateLength: function (facetValue) {
			return this.getValue().length == facetValue;
		}
	});

	return function StringNodeValidator () {
		var obj = objTools.construct(stringNodeValidator, StringNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});
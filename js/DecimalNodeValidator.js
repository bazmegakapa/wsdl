define(['underscore', 'wsdl2/objTools', 'wsdl2/Xml', 'wsdl2/AnySimpleTypeNodeValidator',
	'wsdl2/XmlValidationResult', 'wsdl2/XmlValidationError'],
function (_, objTools, Xml, AnySimpleTypeNodeValidator, XmlValidationResult, XmlValidationError) {
	
	var decimalNodeValidator = objTools.make(AnySimpleTypeNodeValidator, {
		type: 'decimal',
		getBaseFacets: function () {
			return {
				'pattern': /^(\+|-)?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/
			};
		},
		getAllowedFacets: function () {
			return [
				'totalDigits',
				'fractionDigits',
				'pattern', 
				'enumeration',
				'maxInclusive',
				'maxExclusive',
				'minInclusive',
				'minExclusive',
				'assertions'
			];
		},
		validate: function () {
			var errors = [];

			errors = errors.concat(this.validateFacets());

			return new XmlValidationResult(errors);
		},
		validateTotalDigits: function (facetValue) {
			return this.getValue().replace(/\D/g, '').length <= facetValue;
		},
		validateFractionDigits: function (facetValue) {
			var v = this.getValue();
			var fracDigits = v.indexOf('.') === -1
				? 0
				: v.split('.')[1].length;
			return fracDigits <= facetValue;
		}
	});

	return function DecimalNodeValidator () {
		var obj = objTools.construct(decimalNodeValidator, DecimalNodeValidator);
		return obj.init.apply(obj, arguments);
	}

});
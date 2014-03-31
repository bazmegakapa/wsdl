define(function () {

	var xml = {
		createDocument: function (name, namespaces, prefix) {
			var qname = prefix ? [prefix, name].join(':') : name;
			var doc = document.implementation.createDocument(namespaces[0], qname, null);
			_(namespaces).each(function (ns, nskey) {
				doc.documentElement.setAttributeNS(
					'http://www.w3.org/2000/xmlns/', 
					['xmlns', nskey].join(':'), 
					ns
				);
			});
			return doc;
		},
		parseToDom: function (s) {
			if (typeof window.DOMParser != "undefined") {
		        return (new window.DOMParser()).parseFromString(s, "text/xml");
			} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
			    var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
			    xmlDoc.async = "false";
			    xmlDoc.loadXML(s);
			    return xmlDoc;
			} else {
			    throw new Error("No XML parser found");
			}
		},
		serializeToString: function (dom) {
			return new XMLSerializer().serializeToString(dom);
		},
		getNodeText: function (node) {
			return node.textContent;
		},
		setNodeText: function (node, value) {
			node.textContent = value;
		},
		getClosestAncestor: function (node, namespace, tagname) {
			var node = node.parentElement;
			while (!(node.namespaceURI === namespace && node.localName === tagname)) {
				node = node.parentElement;
				if (!node) {
					return null;
				}
			}
			return node;
		},
		formatString: function (xml, spaces) {
		    xml = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
		    spaces = spaces || 4;
		    var formatted = '';
		    var pad = 0;

		    _.each(xml.split('\r\n'), function(node, index) {
		        var indent = 0;
		        var padding = '';
		        if (node.match( /.+<\/\w[^>]*>$/ )) {
		            indent = 0;
		        }
		        else if (node.match( /^<\/\w/ )) {
		            if (pad != 0) {
		                pad -= 1;
		            }
		        }
		        else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
		            indent = 1;
		        }
		        else {
		            indent = 0;
		        }
		        for (var i = 0; i < pad; i++) {
		            padding += new Array(spaces).join(' ');
		        }
		        formatted += padding + node + '\r\n';
		        pad += indent;
		    });

		    return formatted;
		}
	};

	return xml;

});
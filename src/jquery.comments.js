;(function( $ ) {

	"use strict";

	// When invoked, the arguments can be defined in several ways:
	// --
	// .comments() - Gets all child comments.
	// .comments( true ) - Gets all comments (deep search).
	// .comments( value ) - Gets all child comments with the current value.
	// .comments( value, true ) - Gets all comments with the current value (deep search).
	// .comments( name, value ) - Gets all child comments with given name-value pair.
	// .comments( name, value, true ) - Gets all comments with given name-value pair (deep search).
	$.fn.comments = function() {

		var settings = normalizeArguments( arguments );

		var comments = [];

		// Search for comments in each of the current context nodes.
		for ( var i = 0, length = this.length ; i < length ; i++ ) {

			appendAll( 
				comments,
				findComments( this[ i ], settings.deep, settings.name, settings.value )
			);

		}

		// If there is more than one comment, make sure the collection is unique.
		if ( comments.length > 1 ) {

			comments = $.unique( comments );

		}

		// Add the found comments to the stack of jQuery selector execution so that the 
		// user can tranverse back up the stack when done.
		return( this.pushStack( comments, "comments", arguments ) );

	};


	// ---
	// PRIVATE METHODS.
	// ---


	// I add all items in the incoming collection to the end of the existing collection.
	// This performs an in-place append; meaning, the existing array is mutated directly.
	function appendAll( existing, incoming ) {

		for ( var i = 0, length = incoming.length ; i < length ; i++ ) {

			existing.push( incoming[ i ] );

		}

		return( existing );

	}


	// I collect the comment nodes contained within the given root node. 
	function collectComments( rootNode, isDeepSearch ) {

		var comments = [];

		var node = rootNode.firstChild;

		while ( node ) {

			// Is comment node.
			if ( node.nodeType === 8 ) {

				comments.push( node );

			// Is element node (and we want to recurse).
			} else if ( isDeepSearch && ( node.nodeType === 1 ) ) {

				appendAll( comments, collectComments( node, isDeepSearch ) );

			}

			node = node.nextSibling;

		}

		return( comments );

	}


	// I determine if the given name-value pair is contained within the given text.
	function containsAttribute( text, name, value ) {

		if ( ! text ) {

			return( false );

		}

		// This is an attempt to quickly disqualify the comment value without having to
		// incur the overhead of parsing the comment value into name-value pairs.
		if ( value && ( text.indexOf( value ) === -1 ) ) {

			return( false );

		}

		// NOTE: Using "==" to allow some type coersion.
		if ( parseAttributes( text )[ name.toLowerCase() ] == value ) {

			return( true );

		}

		return( false );

	}


	// I filter the given comments collection based on the existing of a "pseudo"
	// attributes with the given name-value pair. 
	function filterCommentsByAttribute( comments, name, value ) {

		var filteredComments = [];

		for ( var i = 0, length = comments.length ; i < length ; i++ ) {

			var comment = comments[ i ];
			
			if ( containsAttribute( comment.nodeValue, name, value ) ) {

				filteredComments.push( comment );

			}

		}

		return( filteredComments );

	}


	// I filter the given comments based on the full-text match of the given value.
	// --
	// NOTE: Leading and trailing white-space is trimmed from the node content before
	// being compared to the given value.
	function filterCommentsByText( comments, value ) {

		var filteredComments = [];

		var whitespace = /^\s+|\s+$/g;

		for ( var i = 0, length = comments.length ; i < length ; i++ ) {

			var comment = comments[ i ];
			var text = ( comment.nodeValue || "" ).replace( whitespace, "" );

			if ( text === value ) {

				filteredComments.push( comment );

			}

		}

		return( filteredComments );

	}



	// I find the comments in the given node using the given, normalized settings.
	function findComments( node, isDeepSearch, name, value ) {

		var comments = collectComments( node, isDeepSearch );

		if ( name ) {

			return( filterCommentsByAttribute( comments, name, value ) );

		} else if ( value ) {

			return( filterCommentsByText( comments, value ) );

		}

		return( comments );

	}


	// I convert the invocation arguments into a normalized settings hash that the search
	// algorithm can use with confidence.
	function normalizeArguments( argumentCollection ) {

		if ( argumentCollection.length > 3 ) {

			throw( new Error( "Unexpected number of arguments." ) );
			
		}

		if ( ! argumentCollection.length ) {

			return({
				deep: false,
				name: "",
				value: ""
			});

		}

		if ( argumentCollection.length === 3 ) {

			return({
				deep: !! argumentCollection[ 2 ],
				name: argumentCollection[ 0 ],
				value: argumentCollection[ 1 ]
			});

		}

		var lastValue = Array.prototype.pop.call( argumentCollection );

		if ( ( lastValue === true ) || ( lastValue === false ) ) {

			if ( ! argumentCollection.length ) {

				return({
					deep: lastValue,
					name: "",
					value: ""
				});

			}

			if ( argumentCollection.length === 1 ) {

				return({
					deep: lastValue,
					name: "",
					value: argumentCollection[ 0 ]
				});

			}

			if ( argumentCollection.length === 2 ) {

				return({
					deep: lastValue,
					name: argumentCollection[ 0 ],
					value: argumentCollection[ 1 ]
				});

			}

		}

		if ( ! argumentCollection.length ) {

			return({
				deep: false,
				name: "",
				value: lastValue
			});

		}

		if ( argumentCollection.length === 1 ) {

			return({
				deep: false,
				name: argumentCollection[ 0 ],
				value: lastValue
			});

		}

		if ( argumentCollection.length === 2 ) {

			return({
				deep: false,
				name: argumentCollection[ 1 ],
				value: lastValue
			});

		}

	}


	// I parse the given text value into a collection of name-value pairs.
	function parseAttributes( text ) {

		var attributes = {};

		var pairPattern = /([a-zA-Z][^=\s]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/gi;

		var matches = null;

		while ( matches = pairPattern.exec( text ) ) {

			attributes[ matches[ 1 ].toLowerCase() ] = ( matches[ 2 ] || matches[ 3 ] || matches[ 4 ] || "" );

		}

		return( attributes );

	}
	
})( jQuery );
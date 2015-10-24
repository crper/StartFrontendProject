( function ( $ ) {
	$( '.treeview-menu' )
		.on( 'click', 'a', function () {
			var $content = $( this )
				.prop( 'outerHTML' );
			$( '.page-tabs-content' )
				.append( $content );
		} )
} )( jQuery )

/* Author:
 julien le corre
 */

$(window).load(function() {

$("body").delegate("#menu1", "click", function() {
  $.scrollTo( $("#sect2"), 400 );
});

var cv = Backbone.Model.extend({
   
    initialize: function (attrs, options) {
        
        //taille ecran
        tailleEcran = $(window).height();
		$(".wrapper > section").each(function(i){  
			if( tailleEcran > parseFloat($(this).find('.contentSection').height()) ) { 
				$(this).find('.contentSection').height(tailleEcran-70); 
				//$(this).find('.contentSection').css('padding',0); 
			}
			//else { $(this).find('.social').css('top', parseFloat($(this).height()) ); }	
		});
		
		$(".wrapper section, .wrapper section#sect1 .wrapper ").height(tailleEcran);
	
	}
	    
});

var model = new cv();



require({
    baseUrl: './js/physicsjs/',
    paths: {
        'physicsjs': 'physicsjs-full',
         'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min'
    }
},[
     'jquery',
    'physicsjs',
    './Satnav',
    './demo-mouse-events',
    './scrollTo',
    './sims/ju-intro',
    

], function(
    $,
    Physics,
    Satnav,
    scroll,
    examples
){

    // each argument after demo-mouse-events is a world object for a demo
    examples = Array.prototype.slice.call( arguments, 5 );

    var currentWorld;
    var $win = $(window)
        ,viewWidth = $win.width()
        ,viewHeight = $win.height()
        ,renderer = Physics.renderer('canvas', {
            el: 'viewport',
            width: viewWidth,
            height: viewHeight,
            meta: true,
            // debug:true,
            styles: {
                'circle': {
                    strokeStyle: 'hsla(60, 37%, 17%, 1)',
                    lineWidth: 1,
                    fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                    angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
                },
                'convex-polygon' : {
                    strokeStyle: 'hsla(60, 37%, 17%, 1)',
                    lineWidth: 1,
                    fillStyle: 'hsla(60, 47%, 37%, 0.8)',
                    angleIndicator: 'none'
                }
            }
        })
        ,mouseEvents
        ;

    // resize events
    $(window).on('resize', function(){

        viewWidth = 500;
        viewHeight = 500;
        
        renderer.el.width = viewWidth;
        renderer.el.height = viewHeight;

        renderer.options.width = viewWidth;
        renderer.options.height = viewHeight;
        
        tailleEcran = $(window).height();
		$(".wrapper section, .wrapper section#sect1 .wrapper ").height(tailleEcran);

    }).trigger('resize');

    // initialize a world showing a demo
    function initWorld( world ){

        // pause it for now
        world.pause();
        // add the renderer
        world.add( renderer );

        Physics.util.ticker.subscribe(function( time, dt ){

            world.step( time );

            // only render if not paused
            if ( !world.isPaused() ){
                world.render();
            }
        });
    }

    // play/pause button
   /* $(document).on('click', '.start-stop', function(e){

        e.preventDefault();
        var paused = currentWorld.isPaused();

        if (paused){
            $(this).text('pause');
            currentWorld.unpause();
        } else {
            $(this).text('play');
            currentWorld.pause();
        }
    });*/

   

    $(function(){

        mouseEvents = Physics.behavior('demo-mouse-events', { el: '#viewport' });
        // init examples control box
        var $ex = $('#examples ul').empty();
        // for all worlds in examples, we'll attach them to the ticker (request animation frame)
      /*  $.each( examples, function( idx, sim ){
            
            var src = sim.sourceUrl;

            // for demo purposes the sim.title properties are set to be the titles of the demos
            $ex.append( '<li><a class="btn-demo" href="#demo-' + idx + '">' + sim.title + '</a>'+ (src? '<a target="_blank" class="btn-src" href="'+ src +'">(code)</a>' : '') +'</li>' )
        });*/

        // start the ticker
        Physics.util.ticker.start();

		currentWorld = Physics( examples[ 0 ] );
        initWorld( currentWorld );
        currentWorld.add( mouseEvents );
        currentWorld.unpause();

    });
    
});


	//end document load
});


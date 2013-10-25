/* Author:
 julien le corre
 */
/*
$(window).load(function() {
*/
	//
	// Je créé mon type de modèle
/*var cv = Backbone.Model.extend({
    // cette méthode est appelée automatiquement
    // à chaque fois que j'instancie ce type de modèle
    initialize: function (attrs, options) {
        console.log('Coucou cv !');
    }
});
// Je créé une instance de ce modèle
var model = new cv();

*/


require({
    baseUrl: './js/physicsjs/',
    paths: {
        'physicsjs': 'physicsjs-full',
         'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
    }
},[
     'jquery',
    'physicsjs',
    './Satnav',
    './demo-mouse-events',
    './sims/simple',
    './sims/newtonian',
    './sims/newtons-revenge',
    './sims/impact',
    './sims/collision',
    './sims/basket',
    './sims/cloth',
    './sims/fruitcake-on-wheels',
    './sims/tree'

], function(
    $,
    Physics,
    Satnav,
    examples
){

    // each argument after demo-mouse-events is a world object for a demo
    examples = Array.prototype.slice.call( arguments, 4 );

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

        viewWidth = $win.width();
        viewHeight = $win.height(); 
        
        renderer.el.width = viewWidth;
        renderer.el.height = viewHeight;

        renderer.options.width = viewWidth;
        renderer.options.height = viewHeight;

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
    $(document).on('click', '.start-stop', function(e){

        e.preventDefault();
        var paused = currentWorld.isPaused();

        if (paused){
            $(this).text('pause');
            currentWorld.unpause();
        } else {
            $(this).text('play');
            currentWorld.pause();
        }
    });

    $(document).on('click', '#examples .collapse', function(e){

        e.preventDefault();
        $('#examples ul').slideToggle();
        $(this).toggleClass('collapsed');
    });

    $(function(){

        mouseEvents = Physics.behavior('demo-mouse-events', { el: '#viewport' });
        // init examples control box
        var $ex = $('#examples ul').empty();
        // for all worlds in examples, we'll attach them to the ticker (request animation frame)
        $.each( examples, function( idx, sim ){
            
            var src = sim.sourceUrl;

            // for demo purposes the sim.title properties are set to be the titles of the demos
            $ex.append( '<li><a class="btn-demo" href="#demo-' + idx + '">' + sim.title + '</a>'+ (src? '<a target="_blank" class="btn-src" href="'+ src +'">(code)</a>' : '') +'</li>' )
        });

        // start the ticker
        Physics.util.ticker.start();

        // hashchange event handling
        Satnav({
            html5: false, // don't use pushState
            force: false, // force change event on same route
            poll: 100 // poll hash every 100ms if polyfilled
        })
        .navigate({
            path: 'demo-{idx}',
            directions: function(params) {
                var idx = params.idx;

                $('#examples ul a.btn-demo').removeClass('on');
                $('#examples ul a[href="#demo-'+idx+'"]').addClass('on');

                if ( idx < examples.length ){

                    if (currentWorld){
                        // delete the old world
                        currentWorld.pause();
                        delete currentWorld;
                    }
                    
                    // initialize the world
                    currentWorld = Physics( examples[ idx ] );
                    initWorld( currentWorld );
                    currentWorld.add( mouseEvents );
                    currentWorld.unpause();
                }
            }
        })
        .otherwise('demo-0') // will route all unmatched paths to #/
        .change(function(params, old) {
            var title = $('#examples ul a[href="#demo-'+params.idx+'"]').text();

            if (window._gaq){
                _gaq.push(['_trackEvent', 'Demos', 'View', title]);
            }
        })
        .go()
        ;
    });
    
});


	//end document load
/*});*/


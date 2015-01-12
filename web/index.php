<?php

require('../vendor/autoload.php');

$app = new Silex\Application();
$app['debug'] = true;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

// Our web handlers

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  //return 'Hello';
});

$app->run();

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <title>Actor’s hall of fame</title>
    <script src="js/jquery-2.1.3.min.js"></script>
    <!-- Latest compiled and minified JavaScript bootstrap -->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/constants.js"></script>
    <script src="js/actorshalloffame.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <!-- Optional theme -->
    <link rel="stylesheet" href="css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="css/actorshalloffame.css" />
  </head>
  <body>
    <!-- Modal Movies -->
    <div class="modal fade" id="modalMovies" tabindex="-1" role="dialog" aria-labelledby="modalMoviesLabel" aria-hidden="true">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="modalMoviesLabel">Actor’s movies</h4>
          </div>
          <div class="modal-body">
            <!-- search movies Navigation bar-->
            <div class="navbar navbar-default">
              <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </button>
              </div>
              <div class="navbar-collapse collapse navbar-responsive-collapse">
                <form class="navbar-form navbar-left">
                  <input id="txtMovie" value="" placeholder="Movie title" class="form-control" />
                  <button onclick="fntFindTitle(txtMovie.value); return false;" class="btn btn-success" title="Search title" value="Search title">
                    Search title
                  </button>
                </form>
              </div>
            </div>
            <!--movies container-->
            <div id="movieContainer"> </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning btn-sm" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="page-header old-tv-screen" id="banner">
        <div class="row">
          <div class="col-lg-12 col-md-11 col-sm-10">
            <h1 class="night-hotel">
              Actor’s hall of fame. <br /><small>The place where all artists want to be</small>
            </h1>
            <p class="lead">Search for your favorite artist and discover in what movies has been</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="navbar navbar-default">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class="navbar-collapse collapse navbar-responsive-collapse">
            <form class="navbar-form navbar-left" role="search">
              <div class="form-group">
                <input id="txtActor" value="" placeholder="Artist name" class="form-control" />
              </div>
              <button onclick="fntFindActor(txtActor.value); return false;" class="btn btn-success" title="Search artist" value="Search artist">
                Search artist
              </button>
            </form>
          </div>
        </div>
      </div>

      <!--artists list-->
      <div id="artistContainer">
      </div>
      <p>
        <img src="img/var_1_0_PoweredByTMDB_Blk_Antitled.png" class="img-thumbnail" width="200" />
        <small>This product uses the TMDb API but is not endorsed or certified by TMDb.</small>
      </p>
    </div>
  </body>
</html>

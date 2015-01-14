// constants shared in all app
var strArtistRow = "<div class='row artist-row'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-responsive img-thumbnail img-circle'  /></div><div class='col-lg-10 col-md-9 col-sm-8'><h1>{lnk}</h1><p><b>Known for:</b> {description}</p><p><a class='btn btn-primary btn-sm' onclick=\"fntFindMovies('{id}')\" >Movies related</a></p></div></div>";
var strMovieRow = "<div class='row movie-row'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-responsive img-thumbnail' width='128' /></div><div class='col-lg-10 col-md-9 col-sm-8'><h2>{lnk}</h2><p>{description}</p></div></div>";
var strKey = "api_key=b03963ee7a5e2836bf673677c6bcddd8";
var strGallery = "https://image.tmdb.org/t/p/w185";

var lnkArtist = "<a id='lnk_{id}' onclick='fntShowPopover({id});' tabindex='0' data-toggle='popover' data-trigger='focus' title='{name}' data-content='{content}'>{name}</a>";
var lnkMovie = "<a id='lnk_{id}' onclick='fntShowMoviePopover({id});' tabindex='0' data-toggle='popover' data-trigger='focus' title='{name}' data-content='{content}'>{name}</a>";

var qryPersonById = "https://api.themoviedb.org/3/person/{id}?api_key=b03963ee7a5e2836bf673677c6bcddd8";
var qryMovieByID = "https://api.themoviedb.org/3/movie/{id}?api_key=b03963ee7a5e2836bf673677c6bcddd8";
var qrySearchMulti = "https://api.themoviedb.org/3/search/multi?api_key=b03963ee7a5e2836bf673677c6bcddd8&query={text}&page={page}";
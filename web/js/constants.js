// constants shared in all app
var strArtistRow = "<div class='row artist-row text-danger'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-responsive img-circle'  /></div><div class='col-lg-10 col-md-9 col-sm-8'>{lnk}<p><b>Known for:</b><h3>{description}</h3></p><p><a class='btn btn-primary btn-sm' onclick=\"fntFindMovies('{id}')\" >Movies related</a></p></div></div>";
var strMovieRow = "<div class='row movie-row text-success'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-responsive img-thumbnail' width='128' /></div><div class='col-lg-10 col-md-9 col-sm-8'>{lnk}<p><b>Release date:</b> {description}</p></div></div>";
var strKey = "api_key=b03963ee7a5e2836bf673677c6bcddd8";
var strGallery = "https://image.tmdb.org/t/p/w185";
// control contents 
var lnkArtist = "<a id='lnk_{id}' onclick='fntShowPopover({id});' tabindex='0' data-toggle='popover' data-trigger='focus'  data-placement='bottom' title='{name}' data-content='{content}'>{name}</a>";
var lnkMovie = "<a id='lnk_{id}' onclick='fntShowMoviePopover({id});' tabindex='0' data-toggle='popover' data-trigger='focus'  data-placement='bottom' title='{name}' data-content='{content}'>{name}</a>";
var lnkWithContent = "<a onclick='fntFind{type}Info({id})' data-toggle='collapse' data-target='#divContent_{id}' aria-expanded='false' aria-controls='collapseExample'><h2>{name}</h2></a><div class='collapse' id='divContent_{id}'><div class='text-primary' id='divInfo_{id}' >{content}</div></div>"

// api querys
var qryPersonById = "https://api.themoviedb.org/3/person/{id}?api_key=b03963ee7a5e2836bf673677c6bcddd8";
var qryMovieByID = "https://api.themoviedb.org/3/movie/{id}?api_key=b03963ee7a5e2836bf673677c6bcddd8";
var qrySearchMulti = "https://api.themoviedb.org/3/search/multi?api_key=b03963ee7a5e2836bf673677c6bcddd8&query={text}&page={page}";
var qryDiscoverMovieByPeopleID = "https://api.themoviedb.org/3/discover/movie?api_key=b03963ee7a5e2836bf673677c6bcddd8&with_people={PersonID}";

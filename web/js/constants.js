﻿// constants shared in all app
var strArtistRow = "<div class='row'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-thumbnail' width='128' /></div><div class='col-lg-10 col-md-9 col-sm-8'><h1>{name}</h1><p><b>Known for:</b> {description}</p><p><a class='btn btn-primary btn-sm' onclick=\"fntFindMovies('{id}')\" >Movies related</a></p></div></div>";
var strMovieRow = "<div class='row'><div class='col-lg-2 col-md-2 col-sm-2'><img src='{img}' class='img-thumbnail' width='128' /></div><div class='col-lg-10 col-md-9 col-sm-8'><h2>{name}</h2><p>{description}</p></div></div>";
var strKey = "api_key=b03963ee7a5e2836bf673677c6bcddd8";
var strGallery = "https://image.tmdb.org/t/p/w185";
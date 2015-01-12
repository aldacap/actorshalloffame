// Global variables
var results = [];
var artistList = [];
var moviesList = [];

// ordering functions 
// order an objet in array by date
function orderByDate(a, b) {
    var c = new Date(a.release_date);
    var d = new Date(b.release_date);
    return c - d;
}

// order an object in arry by name
function orderByName(a, b) {
    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
}

// find an object in array by id
function findById(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === value) {
            return true;
        }
    }
    return false;
}

// retrieve the list of actors in database by name
function fntFindActor(strActor) {
    // reset controls states
    var $btn = $('#btnSearchArtist').button('searching');
    $("#artistContainer").empty();
    artistList = [];

    // controll de ajax request
    var processEnded = 0;

    for (var p = 0; p < 5; p++) {
        $.getJSON("https://api.themoviedb.org/3/search/person?api_key=b03963ee7a5e2836bf673677c6bcddd8&query=" + strActor + "&page=" + p, function (data, textStatus, jqxhr) {

            for (var i = 0; i < data.results.length; i++) {
                if (!findById(artistList, data.results[i]))
                    artistList.push(data.results[i]);
            }
            processEnded++;

            if (processEnded == 4) {
                artistList = artistList.sort(orderByName);
                for (var i = 0; i < artistList.length; i++) {
                    $('#artistContainer').append(configRowArtist(artistList[i]));
                }

                $btn.button('reset');
            }
        });
    }
    return false;
};

// render the controls
function configRowArtist(objArtist) {
    if (objArtist.profile_path === undefined || objArtist.profile_path === null)
        var rowArtist = strArtistRow.replace('{img}', 'img/photo-24-128.png');
    else
        var rowArtist = strArtistRow.replace('{img}', strGallery + objArtist.profile_path);
    rowArtist = rowArtist.replace('{name}', objArtist.name);

    // convert the known for array to string
    var strKnown = "";
    for (var i = 0; i < objArtist.known_for.length; i++) {
        if (objArtist.known_for[i].title !== undefined && objArtist.known_for[i].title !== null)
            strKnown = strKnown.concat(objArtist.known_for[i].title, ", ");
        else if (objArtist.known_for[i].name !== undefined && objArtist.known_for[i].name !== null)
            strKnown = strKnown.concat(objArtist.known_for[i].name, ", ");
        else
            strKnown = strKnown.concat(objArtist.known_for[i].id, ", ");
    }

    rowArtist = rowArtist.replace('{description}', strKnown.substring(0, strKnown.lastIndexOf(",")));
    rowArtist = rowArtist.replace('{id}', objArtist.id);

    return rowArtist;
}

// config the actors movies
function configRowMovie(objMovie) {
    if (objMovie.poster_path === undefined || objMovie.poster_path === null)
        var rowMovie = strMovieRow.replace('{img}', 'img/picture-128.png');
    else
        var rowMovie = strMovieRow.replace('{img}', strGallery + objMovie.poster_path);

    rowMovie = rowMovie.replace('{name}', objMovie.title);
    rowMovie = rowMovie.replace('{description}', objMovie.release_date);

    return rowMovie;
}

// render the actors movies
function fntFindMovies(selectedID) {
    document.getElementById("txtMovie").value = '';
    $('#movieContainer').empty();
    $.getJSON("https://api.themoviedb.org/3/discover/movie?with_people=" + selectedID + "&api_key=b03963ee7a5e2836bf673677c6bcddd8", function (data, textStatus, jqxhr) {
        moviesList = data.results;
        moviesList.sort(orderByDate);

        for (var i = 0; i < moviesList.length; i++) {
            $('#movieContainer').append(configRowMovie(moviesList[i]));
        }

        $('#modalMovies').modal('show');
    });

    return false;
};

// filter and render de actors movies
function fntFindTitle(strTitle) {

    $('#movieContainer').empty();
    var searhList = [];

    // select only the matched criteria 
    for (var i = 0; i < moviesList.length; i++) {
        if (strTitle) {
            if ((moviesList[i].title.toLowerCase().search(strTitle.toLowerCase()) > -1))
                searhList.push(moviesList[i]);
        }
        else
            searhList.push(moviesList[i]);
    }

    // render the selected movies
    searhList.sort(orderByDate);
    for (var i = 0; i < searhList.length; i++) {
        $('#movieContainer').append(configRowMovie(searhList[i]));
    }

    $('#modalMovies').modal('show');

    return false;
};








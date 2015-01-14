// Global variables
var results = [];
var artistList = [];
var moviesList = [];

// first actions after load page
function initPage() {
    $("#txtActor").focus();
}

// begin query search on enter
function evalEnterKey(obj) {
    if (event.keyCode == 13) {
        $("#btnSearchArtist").click();
    }
}

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

// retrieve the list of actors and movies in database by name
function fntFindActor(strFilter) {
    // reset controls states
    var $btn = $('#btnSearchArtist').button('searching');
    $("#artistContainer").empty();
    artistList = [];

    strFilter = strFilter.replace(/[^a-zA-Z ]/g, "");

    if (strFilter) {
        // controll de ajax request
        var currentPage = 1;
        var totalPages = 100;
        while (currentPage <= totalPages) {

            var qry = qrySearchMulti.replace('{text}', strFilter);
            qry = qry.replace('{page}', currentPage);

            $.ajaxSetup({
                async: false
            });

            $.getJSON(qry, function (data, textStatus, jqxhr) {
                totalPages = data.total_pages;
                for (var i = 0; i < data.results.length; i++) {

                    // only include movies and people
                    if (data.results[i].media_type == "person" | (data.results[i].media_type == "movie" && $('#chkIncludeMovies').is(':checked')))
                        if (!findById(artistList, data.results[i]))
                            artistList.push(data.results[i]);
                }
            });

            currentPage++;
        }

        $.ajaxSetup({
            async: true
        });

        artistList = artistList.sort(orderByName);
        for (var i = 0; i < artistList.length; i++) {

            if (artistList[i].media_type == "person")
                $('#artistContainer').append(configRowArtist(artistList[i]));
            else if (artistList[i].media_type == "movie")
                $('#artistContainer').append(configRowMovie(artistList[i]));

        }
    }

    $btn.button('reset');

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

    // regex to replace all names
    var pattern = "{name}";
    re = new RegExp(pattern, "g");
    var infoArtist = lnkArtist.replace(re, objArtist.name);
    infoArtist = infoArtist.replace('{content}', 'loading ...');

    pattern = "{id}";
    re = new RegExp(pattern, "g");
    infoArtist = infoArtist.replace(re, objArtist.id);
    rowArtist = rowArtist.replace('{lnk}', infoArtist);

    return rowArtist;
}

// search the actor biography and whow it in a popover
function fntShowPopover(id) {
    $.getJSON(qryPersonById.replace('{id}', id), function (data, textStatus, jqxhr) {
        $('a#lnk_' + id).attr("data-content", data.biography);
        $('a#lnk_' + id).popover("show");
    });
}

// search the movie overview and show it in a popover
function fntShowMoviePopover(id) {
    $.getJSON(qryMovieByID.replace('{id}', id), function (data, textStatus, jqxhr) {
        $('a#lnk_' + id).attr("data-content", data.overview);
        $('a#lnk_' + id).popover("show");
    });
}

// config the actors movies
function configRowMovie(objMovie) {
    if (objMovie.poster_path === undefined || objMovie.poster_path === null)
        var rowMovie = strMovieRow.replace('{img}', 'img/picture-128.png');
    else
        var rowMovie = strMovieRow.replace('{img}', strGallery + objMovie.poster_path);

    rowMovie = rowMovie.replace('{name}', objMovie.title);
    rowMovie = rowMovie.replace('{description}', objMovie.release_date);

    // regex to replace all names
    var pattern = "{name}";
    re = new RegExp(pattern, "g");
    var infoMovie = lnkMovie.replace(re, objMovie.title);
    infoMovie = infoMovie.replace('{content}', 'loading ...');

    pattern = "{id}";
    re = new RegExp(pattern, "g");
    infoMovie = infoMovie.replace(re, objMovie.id);
    rowMovie = rowMovie.replace('{lnk}', infoMovie);

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








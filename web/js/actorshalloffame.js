// Global variables
var results = [];
var globalArtistList = [];
var globalMoviesList = [];
var globalIDList = [];

// pagging variables
var globalCurrentPage = 1;
var globalTotalPages = 2;

// first actions after page load
function initPage() {
    $("#txtActor").focus();

    resetFooter();

    //Check to see if the window is top if not then display button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

}

function resetFooter() {
    var footerHeight = 0,
             footerTop = 0,
             $footer = $("#footer");

    // move footer to bottom page
    positionFooter();
    function positionFooter() {
        footerHeight = $footer.height();
        footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";
        if (($(document.body).height() + footerHeight) < $(window).height()) {
            $footer.css({
                position: "absolute"
            }).animate({
                top: footerTop
            })
        } else {
            $footer.css({
                position: "static"
            })
        }
    }
    $(window)
            .scroll(positionFooter)
            .resize(positionFooter);
}

// begin query search on enter
function evalEnterKey(obj) {
    if (event.keyCode === 13) {
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
function findById(id) {
    for (var i = 0; i < globalIDList.length; i++) {
        if (globalIDList[i] === id) {
            return true;
        }
    }
    return false;
}

// retrieve the list of actors and movies in database by name
function fntFindActor(strFilter) {

    // reset controls states
    $('#btnSearchArtist').button('loading');
    $("#artistContainer").empty();
    globalCurrentPage = 1;
    globalArtistList = [];
    globalIDList = [];
    strFilter = strFilter.replace(/[^a-zA-Z ]/g, "");
    $('#divProgress').collapse('show');
    //setTimeout(function () {
    searhArtistOrMovies(strFilter);
    //}, 100);
    return false;
};

// Main search function
function searhArtistOrMovies(strFilter) {
    if (strFilter) {

        // ajax request
        if (globalCurrentPage <= globalTotalPages) {
            var qry = qrySearchMulti.replace('{text}', strFilter);
            qry = qry.replace('{page}', globalCurrentPage);

            globalArtistList = [];
            $.getJSON(qry, function (data, textStatus, jqxhr) {

                globalTotalPages = data.total_pages;
                for (var j = 0; j < data.results.length; j++) {

                    // only include movies and people (not tv) 
                    if (data.results[j].media_type === "person" | (data.results[j].media_type === "movie" && $('#chkIncludeMovies').is(':checked')))

                        // exclude adult titles
                        if (!data.results[j].adult) {
                            if (!findById(data.results[j].id)) {
                                globalArtistList.push(data.results[j]);
                                globalIDList.push(data.results[j].id);
                            }
                        }
                }
                // update current page
                globalCurrentPage++;

                // search again if not found results
                if (globalArtistList.length === 0)
                    setTimeout(function () { searhArtistOrMovies(strFilter); }, 100);

                // order the results for current page
                globalArtistList = globalArtistList.sort(orderByName);
                for (var i = 0; i < globalArtistList.length; i++) {

                    // render contents
                    if (globalArtistList[i].media_type === "person") {
                        $('#artistContainer').append(configRowArtist(globalArtistList[i]));
                        globalIDList.push(globalArtistList[i].id);
                    }
                    else if (globalArtistList[i].media_type === "movie") {
                        $('#artistContainer').append(configRowMovie(globalArtistList[i]));
                        globalIDList.push(globalArtistList[i].id);
                    }
                }

                $('#divProgress').collapse('hide');
                $('#btnSearchArtist').button('reset');

                // move footer to bottom page
                resetFooter();

            });
        }
    }
    //$('#btnSearchArtist').button('reset');
}

// find new movies/persons when scroll reach page bottom
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {

        // reset controls states
        $('#btnSearchArtist').button('loading');
        $('#divProgress').collapse('show');
        strFilter = txtActor.value.replace(/[^a-zA-Z ]/g, "");
        searhArtistOrMovies(strFilter);
        return false;
    }
});

// render the person contens
function configRowArtist(objArtist) {

    var existingRowPerson = document.getElementById('divContent_' + objArtist.id);
    if (existingRowPerson) {
        return '';
    }

    var rowArtist = "";
    if (objArtist.profile_path === undefined || objArtist.profile_path === null)
        rowArtist = strArtistRow.replace('{img}', 'img/photo-24-128.png');
    else
        rowArtist = strArtistRow.replace('{img}', strGallery + objArtist.profile_path);
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
    var re = new RegExp(pattern, "g");
    var infoArtist = lnkWithContent.replace(re, objArtist.name);
    infoArtist = infoArtist.replace('{content}', 'loading ...');

    // replace all id´s   
    pattern = "{id}";
    re = new RegExp(pattern, "g");
    infoArtist = infoArtist.replace(re, objArtist.id);
    infoArtist = infoArtist.replace('{type}', 'Person');

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

// search the actor biography and whow it in a popover
function fntFindPersonInfo(id) {
    $.getJSON(qryPersonById.replace('{id}', id), function (data, textStatus, jqxhr) {
        $('div#divInfo_' + id).html(data.biography);
    });
}

// search the actor biography and whow it in a popover
function fntFindMovieInfo(id) {
    $.getJSON(qryMovieByID.replace('{id}', id), function (data, textStatus, jqxhr) {
        $('div#divInfo_' + id).html(data.overview);
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

    var existingRowMovie = document.getElementById('divContent_' + objMovie.id);
    if (existingRowMovie) {
        return '';
    }

    var rowMovie = "";
    if (objMovie.poster_path === undefined || objMovie.poster_path === null)
        rowMovie = strMovieRow.replace('{img}', 'img/picture-128.png');
    else
        rowMovie = strMovieRow.replace('{img}', strGallery + objMovie.poster_path);

    rowMovie = rowMovie.replace('{name}', objMovie.title);
    rowMovie = rowMovie.replace('{description}', objMovie.release_date);

    // regex to replace all names
    var pattern = "{name}";
    var re = new RegExp(pattern, "g");
    var infoMovie = lnkWithContent.replace(re, objMovie.title);
    infoMovie = infoMovie.replace('{content}', 'loading ...');

    pattern = "{id}";
    re = new RegExp(pattern, "g");
    infoMovie = infoMovie.replace(re, objMovie.id);

    infoMovie = infoMovie.replace('{type}', 'Movie');

    rowMovie = rowMovie.replace('{lnk}', infoMovie);

    return rowMovie;
}

// render the actors movies
function fntFindMovies(selectedID) {
    document.getElementById("txtMovie").value = '';
    $('#movieContainer').empty();

    var qry = qryDiscoverMovieByPeopleID.replace('{PersonID}', selectedID);
    $.getJSON(qry, function (data, textStatus, jqxhr) {
        globalMoviesList = data.results;
        globalMoviesList.sort(orderByDate);

        for (var i = 0; i < globalMoviesList.length; i++) {
            $('#movieContainer').append(configRowMovie(globalMoviesList[i]));
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
    for (var i = 0; i < globalMoviesList.length; i++) {
        if (strTitle) {
            if ((globalMoviesList[i].title.toLowerCase().search(strTitle.toLowerCase()) > -1))
                searhList.push(globalMoviesList[i]);
        }
        else
            searhList.push(globalMoviesList[i]);
    }

    // render the selected movies
    searhList.sort(orderByDate);
    for (var i = 0; i < searhList.length; i++) {
        $('#movieContainer').append(configRowMovie(searhList[i]));
    }

    $('#modalMovies').modal('show');

    return false;
};








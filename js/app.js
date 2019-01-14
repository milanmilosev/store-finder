var userLatLng,
    map,
    bounds,
    marker,
    myLatlng,
    infoWindow,
    allmarkers = [],
    currentInfoWindow = false,
    noResults,
    myLocationMarker = [],
    bounds = new google.maps.LatLngBounds();
    jsonURL = 'https://storage.googleapis.com/infarm-backend-public/farm_info/farm_info.json';
    initLatLng = {
        lat: 52.530643,
        lng: 13.383066
    };

var mapResultsContainer  = document.getElementById('map'),
    listResultsContainer = document.getElementById('mapList'),
    noResultsSuggestion  = document.getElementById('noResults'),
    showAvailableCities  = document.getElementById('showAvailableCities'),
    spinner              = document.getElementsByClassName('spinner')[0],
    mapResultsButton     = document.getElementById('showMapResults'), 
    listResultsButton    = document.getElementById('showListResults');

    
// mobile check
window.mobilecheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// fetch data
initLocationList = () => {
    fetch(jsonURL)
        .then( response => response.json())
        .then( data => sortLocationList(data))
        .catch(function() {
            console.log('initLocationList() fetch data error');
        });
}

// map initialization
initMap = () => {
  map = new google.maps.Map(mapResultsContainer, {
      zoom: 12,
      center: initLatLng,
      styles: [{
        elementType: 'geometry',
        stylers: [{
          color: '#f5f5f5'
        }]
      }, {
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#616161'
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#f5f5f5'
        }]
      }, {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#bdbdbd'
        }]
      }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#eeeeee'
        }]
      }, {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#757575'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#e5e5e5'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9e9e9e'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#ffffff'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#757575'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#dadada'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#616161'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9e9e9e'
        }]
      }, {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{
          color: '#e5e5e5'
        }]
      }, {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{
          color: '#eeeeee'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#c9c9c9'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9e9e9e'
        }]
      }]
    }),
  initLocationList();
}

// assing function to marker info window
var assignListener = function (markerObj, infoWindowObj) {
    return function () {
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }
        currentInfoWindow = infoWindowObj;
        infoWindowObj.open(map, markerObj);
    };
};

// iterate through json \\ create allmarkers global array
sortLocationList = (data) => {
    bounds = new google.maps.LatLngBounds();
    for (var farm in data.farms) {
        if (data.farms[farm].coordinates) {
                myLatlng = new google.maps.LatLng(data.farms[farm].coordinates.lat, data.farms[farm].coordinates.lng);
                marker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: {lat: data.farms[farm].coordinates.lat, lng: data.farms[farm].coordinates.lng},
                    map: map,
                    organization: data.farms[farm]['organization'],
                    category: data.farms[farm]['category'],
                    postcode: data.farms[farm]['postcode'],
                    address: data.farms[farm]['line_1'],
                    city: data.farms[farm]['city'],
                    country: data.farms[farm]['country'],
                    icon: 'https://infarm.com/wp-content/themes/infarm-child/images/map-marker-alt-75.svg'
                });

                // regex - format farm name ex: "HAN [Edeka]" => Edeka
                var farmName = `${data.farms[farm]['organization']}`;
                '[' == farmName.substr(4, 1) && (farmName = farmName.substr(5), farmName = farmName.substr(0, farmName.length - 1));
                // -- //
                var dataForInfoWindow = `
                        <span class="map-infopanel">
                            <strong>${data.farms[farm]['category']}</strong>
                            <h4>${farmName}</h4>
                            <p>${data.farms[farm]['line_1']} <br>
                            ${data.farms[farm]['postcode']}, 
                            ${data.farms[farm]['city']},
                            ${data.farms[farm]['country']}<p>
                            <h5 class="map-directions" data-coordinates="${myLatlng}" onclick="showMeDirection(this)">Direction</h5>
                        </span>
                        `;
                infoWindow = new google.maps.InfoWindow({
                    content: dataForInfoWindow
                });
                marker.addListener('click', assignListener(marker, infoWindow));

                var loc = new google.maps.LatLng(data.farms[farm].coordinates.lat, data.farms[farm].coordinates.lng);
                bounds.extend(loc);
                map.fitBounds(bounds);
                map.panToBounds(bounds);
                allmarkers.push(marker);
        }
    }
    showNumberOfResults();
}

// Shows any markers currently in the array.
setBoundsNow = () => setBounds(map);

// Sets the map on all markers in the array.
setMapOnAll = (map) => {
    for (var i = 0; i < allmarkers.length; i++) {
        allmarkers[i].setMap(map);
        // showNumberOfResults();
    }
}

// Removes the markers from the map, but keeps them in the array.
clearMarkers  = () => setMapOnAll(null);

// Shows any markers currently in the array.
showMarkers   = () =>  setMapOnAll(map);

// Deletes all markers in the array by removing references to them.
deleteMarkers = () => clearMarkers(); markers = [];

// ####
// call google maps on window load
// ####
google.maps.event.addDomListener(window, 'load', initMap);

//
// Autocomplete component
//
var inputAddress = document.getElementById('location-input');

// set event Listener for enter key
inputAddress.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        checkVariable();
    }
});

autocomplete = new google.maps.places.Autocomplete(inputAddress);

var pac_input = document.getElementById('location-input');

// Autocomplete and SearchBox widgets 
(function pacSelectFirst(input) {
    // store the original event binding function
    var _addEventListener = input.addEventListener ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
        // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
        // and then trigger the original listener.

        if (type == "keydown") {
            var orig_listener = listener;
            listener = function (event) {
                var suggestion_selected = document.querySelector('.pac-item-selected');
                if (event.which == 13 && suggestion_selected === null) {
                    // Simulate down arrow event
                    var simulated_downarrow = JSON.parse(JSON.stringify(event));
                    simulated_downarrow.which = 40;
                    simulated_downarrow.keyCode = 40;
                    orig_listener.apply(input, [simulated_downarrow]);
                }

                orig_listener.apply(input, [event]);
            };
        }

        // add the modified listener
        _addEventListener.apply(input, [type, listener]);
    }

    if (input.addEventListener) input.addEventListener = addEventListenerWrapper;else if (input.attachEvent) input.attachEvent = addEventListenerWrapper;
})(pac_input);

checkVariable = () =>  autocomplete.getPlace() ? runAutocomplete() : setTimeout(checkVariable, 25);

function runAutocomplete() {
    // prevent submit if the input is empty
    if (!inputAddress.value) {
        return false;
    }

    // get location from input element
    var location = autocomplete.getPlace();
    lat = location['geometry']['location'].lat();
    lng = location['geometry']['location'].lng();

    // call function and update map
    updateMap(lat, lng);
}

// Geolocation
function getMyLocation(e) {
    e.preventDefault();
    // add active class for loader
    document.getElementById('location-getMylocation').classList.add('active');
    // get location based on user geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        mylocation.innerHTML = 'Geolocation is not supported by this browser.';
    }
    function successFunction(position) {
        // remove active class for loader
        document.getElementById('location-getMylocation').classList.remove('active');
        // call function and update map
        updateMap(position.coords.latitude, position.coords.longitude);
    }
    function errorFunction(position) {
        console.log('Error:' + position);
    }
}
//______________________________________________________________________________//


//
// Update map based on user location
// 
function updateMap(lat, lng) {
    spinner.style.display = 'block';
    // check if is there a previous 'mylocation' and remove double
    if (myLocationMarker.length > 0) {
        for (var i = 0; i < myLocationMarker.length; i++) {
            myLocationMarker[i].setMap(null);
        }
    }
    userLatLng = new google.maps.LatLng(lat, lng);
    // set map zoom
    map.setZoom(11);
    // set to the center user location
    map.setCenter(userLatLng);
    myLocationMarker.push(new google.maps.Marker({
        position: userLatLng,
        map: map,
        icon: '/wp-content/themes/infarm-child/images/map-pin.svg'
    }));
    showNumberOfResults();
    // check if there is searching results
    if (!noResults) {
        showMapResults();
        noResultsSuggestion.style.display = 'none';
    }
}

// change place on map // all // stores // restaurants
changePlace = function(value, optionIndex) {
    if (optionIndex != null) {
        var option = document.getElementById('sel').options[optionIndex];
        option.selected = true;
        value = option.value;
    }
    if (value === 'STORE') {
        showNumberOfResults(value);
    } else if (value === 'RESTAURANT') {
        showNumberOfResults(value);
    } else {
        showNumberOfResults();
    }
};

// show number of results & update the list
function showNumberOfResults(value) {
    var bounds = map.getBounds(),
        count = 0;
    listResultsContainer.innerHTML = '';
    deleteMarkers();
    // if value = STORE or RESTAURANT do counting
    for (var i = 0; i < allmarkers.length; i++) {
        if (allmarkers[i].category === value) {
            allmarkers[i].setMap(map);
            var marker = allmarkers[i];
            listResultsContainer.innerHTML += `
                    <div class="container info info-${i + 1}">
                        <div class="row mt-3">
                            <div class="col-md-12">${allmarkers[i].category}</div>
                            <div class="col-md-4"><b>${allmarkers[i].organization}</b></div>
                            <div class="col-md-4"><b>${allmarkers[i].address}, ${allmarkers[i].postcode} ${allmarkers[i].country}</b></div>
                            <div class="col-md-4" data-coordinates="${allmarkers[i].position}" onclick="showMeDirection(this)">Direction  -></div>
                        </div>
                    </div>
                `;
            infoPanel = $('.info-' + (i + 1));
 
            if (bounds.contains(marker.getPosition()) === true) {
                infoPanel.show();
                count++;
            } else {
                infoPanel.hide();
            }
        }
    }
    // if there is no Value(all), show all available markers Stores & Restaurants
    if (!value) {
        for (var i = 0; i < allmarkers.length; i++) {
            allmarkers[i].setMap(map);
            var marker = allmarkers[i];
            listResultsContainer.innerHTML += `
                    <div class="container info info-${i + 1}">
                        <div class="row mt-3">
                            <div class="col-md-12">${allmarkers[i].category}</div>
                            <div class="col-md-4"><b>${allmarkers[i].organization}</b></div>
                            <div class="col-md-4"><b>${allmarkers[i].address}, ${allmarkers[i].postcode} ${allmarkers[i].country}</b></div>
                            <div class="col-md-4" data-coordinates="${allmarkers[i].position}" onclick="showMeDirection(this)">Direction -></div>
                        </div>
                    </div>
                `;
            infoPanel = $('.info-' + (i + 1));

            if (bounds.contains(marker.getPosition()) === true) {
                infoPanel.show();
                count++;
            } else {
                infoPanel.hide();
            }
        }
    }
    // if count = 0, there is no results, call showNoReultsMsg and send count value
    if (count === 0) {
        showNoResultsMsg(count);
        // set global search results true
        noResults = true;
    } else {
        // set global search results false
        noResults = false;
    }
    // show on page number of results
    document.getElementById('results-number').innerHTML = count + ' ' + 'RESULTS';
    spinner.style.display = 'none';
    

    // show list on mobile devices
    if (mobilecheck()) {
        showListResults();
    }
}

// no results -- show available cities
showNoResultsMsg = (count) => {
    // remove previous list results
    listResultsContainer.innerHTML = '';
    // remove previous results
    showAvailableCities.innerHTML = '';
    // hide map
    mapResultsContainer.style.display = 'none';
    // show on page no results info
    noResultsSuggestion.style.display = 'block';
    // show available cities
    uniqueCities = [...new Set(allmarkers.map(a => a.country))];
    for (var x in uniqueCities) {
        // don't show 'undefined' results
        if (uniqueCities[x] !== undefined) {
            showAvailableCities.innerHTML += `<span onclick="showSuggestedCity('${uniqueCities[x]}')">${uniqueCities[x]}<span> `;
        }
    }
}

showSuggestedCity = (cityName) => {
    // get city name
    var chosenCity = cityName;
    // get city coordinates
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': chosenCity }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            updateMap(lat, lng);
            userLatLng = new google.maps.LatLng(lat, lng);
            // set map zoom
            // if there is no bounds on map (visibles markers) map will stay hidden
            // tbd?
            map.setZoom(7);
            // set to the center user location
            map.setCenter(userLatLng);
            // push new position
            myLocationMarker.push(new google.maps.Marker({
                position: userLatLng,
                map: map,
                icon: '/wp-content/themes/infarm-child/images/map-pin.svg'
            }));
            // hide list
            listResultsContainer.style.display = 'none';
            // hide no results msg
            noResultsSuggestion.style.display = 'none';
            // show map
            mapResultsContainer.style.display = 'block';
            // show number of results
            showNumberOfResults();
        } else {
            console.log("Something got wrong " + status);
        }
    });
}

showListResults = () =>  {
    mapResultsContainer.style.display = 'none', 
    mapResultsContainer.classList.remove('active'), 
    listResultsContainer.style.display = 'block', 
    listResultsContainer.classList.add('active'), 
    listResultsButton.classList.add('active'), 
    mapResultsButton.classList.remove('active');
}

showMapResults = () => {
    listResultsContainer.style.display = 'none', 
    listResultsContainer.classList.remove('active'), 
    mapResultsContainer.style.display = 'block', 
    mapResultsContainer.classList.add('active'), 
    mapResultsButton.classList.add('active'), 
    listResultsButton.classList.remove('active');
}

// Direction
showMeDirection = (cords) => {
    var c = cords.getAttribute('data-coordinates').replace(/[(\)]/g, '');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${c}`);
}

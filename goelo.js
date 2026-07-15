let map;
let marker;



function gosend() {

    if (!navigator.geolocation) {

        alert("Geolocation not supported");

        return;

    }

    document.getElementById("status").innerHTML = "Getting GPS...";

    navigator.geolocation.getCurrentPosition(

        success,

        error,

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}

async function success(position) {

    const lat = position.coords.latitude;

    const lng = position.coords.longitude;

    const acc = position.coords.accuracy;

    document.getElementById("status").innerHTML = "Success";

    document.getElementById("lat").innerHTML = lat;

    document.getElementById("lng").innerHTML = lng;

    document.getElementById("accuracy").innerHTML = acc + " meters";

    map = new google.maps.Map(document.getElementById("map"), {

        center: { lat: lat, lng: lng },

        zoom: 18

    });

    marker = new google.maps.Marker({

        position: { lat: lat, lng: lng },

        map: map

    });

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`;

    const response = await fetch(url);

    const data = await response.json();

    if (data.status === "OK") {

        document.getElementById("address").innerHTML =

            data.results[0].formatted_address;

    } else {

        document.getElementById("address").innerHTML =

            "Address not found";

    }

}

function error(err) {

    document.getElementById("status").innerHTML =

        err.message;

}
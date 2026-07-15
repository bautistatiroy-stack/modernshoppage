// ============================
// GOOGLE APPS SCRIPT URL
// ============================
const url = "https://script.google.com/macros/s/AKfycbxhY81dzMziv2WlER2JUTRIwzfr541q0v136nf8qmxLm5BmPRtUOJq_ndTyHltUPnuQ2Q/exec";

// ============================
// LOAD ORDER DETAILS
// ============================
function gosend() {

    const form = document.getElementById("form");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");

    // Customer Information
    const name = localStorage.getItem("name") || "";
    const address = localStorage.getItem("address") || "";
    const phone = localStorage.getItem("phone") || "";
    const delivery = localStorage.getItem("deliver") || "";
    const orderType = localStorage.getItem("orderType") || "";

    // GPS
    const lat = localStorage.getItem("lat") || "";
    const lng = localStorage.getItem("lng") || "";

    // Cart
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
        msg.innerHTML = "Your cart is empty.";
        return;
    }

    let total = 0;
    let itemsHTML = "";

    cartItems.forEach(item => {

        const subtotal = item.price * item.qty;
        total += subtotal;

        itemsHTML += `
        <div class="item">
            <b>${item.name}</b><br>
            Price: ₱${item.price}<br>
            Qty: ${item.qty}<br>
            Subtotal: ₱${subtotal}
            
        </div>
        `;

    });

    // Display
    document.getElementById("n").innerText = name;
    document.getElementById("a").innerText = address;
    document.getElementById("p").innerText = phone;
    document.getElementById("d").innerText = delivery;
    document.getElementById("o").innerText = orderType;
    document.getElementById("l").innerText = lat + ", " + lng;
    document.getElementById("itemList").innerHTML = itemsHTML;
    document.getElementById("t").innerText = total;
    document.getElementById("l").innerText = lat + ", " + lng;

    // Hidden Inputs
    document.getElementById("name").value = name;
    document.getElementById("address").value = address;
    document.getElementById("phone").value = phone;
    document.getElementById("deliver").value = delivery;
    document.getElementById("orderType").value = orderType;
    document.getElementById("items").value = JSON.stringify(cartItems);
    document.getElementById("total").value = total;
    document.getElementById("location").value = lat + "," + lng;

    // Remove old listener
    form.onsubmit = async function(e) {

        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Sending...";
        msg.innerHTML = "Submitting order...";

        try {

            const response = await fetch(url, {
                method: "POST",
                body: new FormData(form)
            });

            const result = await response.text();

            if (response.ok) {

                msg.innerHTML = "✅ Thank you for your order! 😊🍔";

                localStorage.removeItem("cart");

            } else {

                msg.innerHTML = "❌ " + result;

            }

        } catch (err) {

            msg.innerHTML = "❌ Network Error";

        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Send Order";

    };

}

// ============================
// GPS LOCATION
// ============================

let map;
let marker;

function gosend() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    document.getElementById("status").innerHTML = "Getting GPS...";

    navigator.geolocation.getCurrentPosition(
        success,
        error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );

}

async function success(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Save GPS
    localStorage.setItem("lat", lat);
    localStorage.setItem("lng", lng);

    document.getElementById("status").innerHTML = "GPS Found";
    document.getElementById("lat").innerHTML = lat;
    document.getElementById("lng").innerHTML = lng;
    document.getElementById("accuracy").innerHTML = accuracy + " meters";

    // Google Map
    map = new google.maps.Map(document.getElementById("map"), {

        center: {
            lat: lat,
            lng: lng
        },

        zoom: 18

    });

    marker = new google.maps.Marker({

        position: {
            lat: lat,
            lng: lng
        },

        map: map

    });

    // Reverse Geocoding
    const apiKey = "YOUR_API_KEY";

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

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

    document.getElementById("status").innerHTML = err.message;

}
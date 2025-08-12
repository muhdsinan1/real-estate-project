function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiSqft").value;
    var bhk = getBHKValue();
    var bath = getBathValue();
    var location = document.getElementById("uiLocations").value;
    var estPrice = document.getElementById("uiEstimatedPrice");

    var url = "http://127.0.0.1:5000/predict_home_price";

    $.post(url, {
        total_sqft: sqft,
        bhk: bhk,
        bath: bath,
        location: location
    }, function(data, status) {
        console.log(data);
        if (data.estimated_price) {
            estPrice.innerHTML = "<h2>Estimated Price: ₹ " + data.estimated_price + " Lakh</h2>";
        } else {
            estPrice.innerHTML = "<h2>Error: " + (data.error || "Invalid input") + "</h2>";
        }
    });
}

function onPageLoad() {
    console.log("Document loaded");

    var url = "http://127.0.0.1:5000/get_location_names";
$.get(url, function(data, status) {
    console.log("Received location data");
    if (data && data.locations) {
        var locations = data.locations;
        var uiLocations = document.getElementById("uiLocations");
        $('#uiLocations').empty(); // Clear previous options

        $('#uiLocations').append(new Option("Choose a Location", ""));

        for (var i in locations) {
            var opt = new Option(locations[i]);
            $('#uiLocations').append(opt);
        }
    }
});

}

window.onload = onPageLoad;

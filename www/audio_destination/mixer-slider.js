connection.onstream = function(event) {
    console.log('=>Event is trapped');//event.mediaElement.volume = 100
    console.log(event);
//    document.body.appendChild( event.mediaElement );

    var jumbotronId = event.mediaElement.id + '-jumbotron';
    var sliderId = event.mediaElement.id + '-slider';
    var sliderInputId = sliderId + '-input';

    var jumbotron = document.createElement("DIV");
    jumbotron.setAttribute("class", "jumbotron");
    jumbotron.setAttribute("id", jumbotronId);
    var title = document.createElement("H3");
    title.innerText = event.userid;
    jumbotron.appendChild(title);

//    jumbotron.appendChild(event.mediaElement); // Default audio mediaElement

    var volumeSlider = document.createElement("INPUT");
    volumeSlider.setAttribute("id", sliderInputId);
    jumbotron.appendChild(volumeSlider);

    document.getElementById('main-container').appendChild(jumbotron);

    $('#' + sliderInputId).bootstrapSlider({
        formatter: function(value) {
            return 'Current value: ' + value;
        },
        id: sliderId,
        min: 0,
        max: 100,
        value: event.mediaElement.volume * 100
    });

    $('#' + sliderInputId).on("slide", function(slideEvent) {
        var volume = slideEvent.value / 100;
        console.log('slider change ' + volume);
        event.mediaElement.volume = volume;
    });
};

var defaultOnStreamEnded = connection.onstreamended;
connection.onstreamended = function(stream) {
    alert("oui");
    console.log(stream);
    defaultOnStreamEnded(stream) // Execute onstreamended default behaviour (remove the mediaelement)

    var jumbotronId = stream.streamid + '-jumbotron';
    $('#' + jumbotronId).remove();
//   $('#' + sliderInputId).remove();
};

window.addEventListener("DOMContentLoaded", function() {
}, false);


/*window.addEventListener("DOMContentLoaded", function() {
    $('#ex2').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });

    $('#ex2').on("slide", function(slideEvent) {
        console.log('slider change ' + slideEvent.value);
    });
}, false);*/
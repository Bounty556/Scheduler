$(document).ready(function() {
    $("#current-day").text(moment().format('MMMM D YYYY'));

    $("#time-slots").empty();

    // Generate all event time slots for today
    createTimeSlots();

    // Functionality when clicking "save"
    $(document).on('click', '.save-btn', saveEvent);
});

function createTimeSlots() {
    let startTime = moment();
    let currentDaysEvents = JSON.parse(localStorage.getItem(moment().format('MMMMDDYYYY')));
    let currentHour = moment().hour();

    // Start at 9 am
    startTime.hour(9);
     
    // Go until 5 pm
    while (startTime.hour() <= 17) {
        let divRow = $("<div>").attr("class", "row");
        let pHour = $("<p>").attr("class", "hour");
        let textareaDesc = $("<textarea>");
        let saveButton = $("<button>").attr("class", "save-btn");
        
        let formattedTime = startTime.format("hA");

        // Display the text as 1 PM for example
        pHour.text(startTime.format("h A"));

        if (currentHour > startTime.hour()) {
            textareaDesc.attr("class", "description past");
        } else if (currentHour == startTime.hour()) {
            textareaDesc.attr("class", "description present");
        } else if (currentHour < startTime.hour()) {
            textareaDesc.attr("class", "description future");
        }

        textareaDesc.attr("id", formattedTime)

        // Check if current time slot has an event added already
        if (currentDaysEvents != null && currentDaysEvents[formattedTime] != null) {
            textareaDesc.text(currentDaysEvents[formattedTime]);
        }

        saveButton.html("<i class=\"far fa-save\"></i>");
        saveButton.attr("data-hour", formattedTime);

        divRow.append(pHour);
        divRow.append(textareaDesc);
        divRow.append(saveButton);

        $("#time-slots").append(divRow);

        // Go to the next hour
        startTime.hour(startTime.hour() + 1);
    }
}

function saveEvent() {
    // See if days events exists
    let currentDaysEvents = JSON.parse(localStorage.getItem(moment().format('MMMMDDYYYY')));

    if (currentDaysEvents == null) {
        currentDaysEvents = {};
    }

    // Grab the hour the button is associated with
    let hour = $(this).attr("data-hour");

    // Set the text of the hour in the saved object to be what's in the textarea input
    currentDaysEvents[hour] = $("#" + hour).val();

    localStorage.setItem(moment().format("MMMMDDYYYY"), JSON.stringify(currentDaysEvents));
}
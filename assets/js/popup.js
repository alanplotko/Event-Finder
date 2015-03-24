var request;
var id;

// Get user's location via form and submit to EventBrite API
$(function() {
  $("#eventSearch").submit(function(e) {
    // Build query from form fields
    var query = {
      "address": $("#address").val(),
      "range": $("#range").val(),
      "city": $("#city").val(),
      "region": $("#region").val(),
      "country": $("#country").val(),
    };

    // Form status for sending to Eventbrite API
    var completeForm = false;

    // Remove unused properties from the query
    for(var input in query) {
      if(query[input].length > 0) {
        completeForm = true;
      }
      else
      {
        delete query[input];
      }
    }
    
    // Error if address and range are not filled out together
    if( (!$("#address").val() && $("#range").val()) || ($("#address").val() && !$("#range").val()) ) {
      $("#errors").text("Error: Address and range must be filled together.");
      $("#results").hide();
      $("#errors").show();
    }
    // Error if country is not 2 characters
    else if($("#country").val().length > 0 && $("#country").val().length != 2) {
      $("#errors").text("Error: Country must be a 2-letter country code, according to the ISO 3166 format.");
      $("#results").hide();
      $("#errors").show();
    }
    // Error if range is not a number
    else if($("#range").val() && !$.isNumeric($("#range").val())) {
      $("#errors").text("Error: Range must be a number.");
      $("#results").hide();
      $("#errors").show();
    }
    // Remove empty properties from the query
    else {
      if($("#range").val()) {
        query.range += "mi";
      }

      if(completeForm) {
        // Hide form, error reports, and results from the previous search
        $("#eventSearch, #errors, #results").hide();
          chrome.storage.local.set({
            "eventbriteLoading": true
          }, function() {
            findEvents(query);
          });
      }
      else {
        $("#results").hide();
        $("#errors").text("Error: Please provide at least one piece of information for your search.");
        $("#errors").show();
      }
    }
    e.preventDefault();
  });
});

// Clear previous search results upon clear button click
$(function() {
  $("#clear").click(function(e) {
    clear();
    e.preventDefault();
  });
});

// Erase event list
function clear() {
  // Clear all items from storage that were saved by the extension
  chrome.storage.local.remove(["eventbriteSearch", "eventbriteSearchResults", "eventbriteLoading"]);
  $("#events, #results").html("");  // Empty information boxes
  $("html, body").height($("body div:first-child").height());
  $("#clear, #results").hide(); // Hide unneeded buttons
  $("#eventSearch").show();     // Show form for next search
}

// Find events based on crtieria filled out in form
function findEvents(query) {
  $("#spinner").fadeIn(); // Show loading animation
  $("html, body").height($("body div:first-child").height());
  
  /**
   *  Determine if the user wants weekend events;
   *  Eventbrite API had issues parsing UTC and ISO -formatted
   *  dates and "next weekend" is slightly vague. Decided to
   *  go with "next weekend" indicating the upcoming weekend
   *  and using "this_weekend" for the keyword to obtain events
   *  happening in the next weekend.
   */
  var sdate = "";
  if($("#weekend_events").prop("checked")) {
    sdate = "this_weekend";
  }

  // Request events from Eventbrite API
  chrome.runtime.sendMessage({
    url: "https://www.eventbriteapi.com/v3/events/search/",
    data: {
      "location.address": query.address,
      "location.within": query.range,
      "venue.city": query.city,
      "venue.region": query.region,
      "venue.country": query.country,
      "popular": "on",
      "start_date.keyword": sdate,
      "token": "FE5IMFHRNI45OROT3XWO"
    }
  });
}

// Update popup contents
function updatePopup() {
  chrome.storage.local.get(["eventbriteSearch", "eventbriteSearchResults", "eventbriteLoading"], function(data) {
    if(data.eventbriteLoading) {
      $("#eventSearch, #errors, #results").hide();
      $("html, body").height($("body div:first-child").height());
      $("#spinner").fadeIn();
    }
    if((!data.eventbriteLoading && data.eventbriteSearch) || (data.eventbriteLoading && (data.eventbriteSearch || data.eventbriteSearchResults))) {
      $("#spinner").fadeOut(function() {
        if(data.eventbriteSearchResults) {
          $("#results").append(data.eventbriteSearchResults);
          $("#results").show();
        }
        if(data.eventbriteSearch) {
          $("#events").append(data.eventbriteSearch);
          $("#events").show();
        }
        $("#eventSearch").hide();
        $("#clear").show();
        chrome.storage.local.set({
          "eventbriteLoading": false
        });
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // Can submit partial information
  $("input").each(function() {
    $(this).attr("required", false);
  });
  updatePopup();
});
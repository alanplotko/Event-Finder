// Get number of days until event start date
function getDaysBetween(today, startDate) {
  var day = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  return Math.round(Math.abs((startDate.getTime() - today.getTime())/(day)));
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

chrome.runtime.onMessage.addListener(function(request) {
    $.ajax({
        url: request.url,
        data: request.data
    }).done(function(data) {
        var list = $("<ul>");

        // Get total number of events
        var numberEvents = 0;
        if(data.pagination.page_count > 1) {
          numberEvents = data.pagination.page_size;
        }
        else {
          numberEvents = data.pagination.object_count;
        }
        if($("#weekend_events").prop("checked")) {
            chrome.storage.local.set({
                "eventbriteSearchResults": "Found " + numberEvents + " popular events near your location that are happening next weekend."
            });
        }
        else {
            chrome.storage.local.set({
                "eventbriteSearchResults": "Found " + numberEvents + " popular events near your location."
            });
        }

        // Traverse all events and mark recently created events
        for(var e in data.events)
        {
          var bullet = $("<li>");
          var evnt = data.events[e];
          var days = getDaysBetween(new Date(), new Date(evnt.start.utc));
          var thelink = $("<a>", {
            text: evnt.name.text,
            title: evnt.name.text,
            href: evnt.url,
            target: "_blank"
          });

          // Show "upcoming" badge for events that start soon
          if(days < 2) {
            thelink.text("");
            thelink.html("<span class='new badge'></span>" + evnt.name.text);
          }
          bullet.append(thelink);
          list.append(bullet);
        }
        if(data.events.length > 0) {
            chrome.storage.local.set({
              "eventbriteSearch": $(list)[0].outerHTML
            }, function() {
              try {
                var popup = $(chrome.extension.getViews({type: "popup"})[0].document);
                popup.find("#spinner").fadeOut(function() {
                  chrome.storage.local.get(["eventbriteSearch", "eventbriteSearchResults", "eventbriteLoading"], function(data) {
                    if(data.eventbriteSearchResults) {
                      popup.find("#results").append(data.eventbriteSearchResults);
                      popup.find("#results").show();
                      popup.find("#eventSearch").hide();
                      popup.find("#clear").show();
                    }
                    if(data.eventbriteSearch) {
                      popup.find("#events").append(data.eventbriteSearch);
                      popup.find("#events").show(); 
                      popup.find("#eventSearch").hide();
                      popup.find("#clear").show();
                    }
                  });
                });
              }
              catch(e) {
                chrome.notifications.create("eventbrite-search-complete", {
                  "type": "progress",
                  "iconUrl": "icon-128.png",
                  "title": "Completed Search",
                  "message": "Completed fetching all events near your location. Click the Event Finder icon to show events near you.",
                  "progress": 100
                }, function() {});
              }
          });
        }
    });
});
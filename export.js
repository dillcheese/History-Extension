// Add event listeners to buttons
document.getElementById("exportCSV").addEventListener("click", function() {
    exportHistory("csv");
  });
  document.getElementById("exportJSON").addEventListener("click", function() {
    exportHistory("json");
  });
  document.getElementById("exportTXT").addEventListener("click", function() {
    exportHistory("txt");
  });

// Add event listener to the "rate" selectbox element
document.getElementById("rate").addEventListener("change", function() {
  // Save the selected value
  chrome.storage.sync.set({rate: this.value});
});

// Retrieve the saved value of the "rate" selectbox element
chrome.storage.sync.get("rate", function(data) {
  // Get the "rate" select element
  var rateSelect = document.getElementById("rate");

  // Set the selected value
  rateSelect.value = data.rate;
});


  // Add event listener to the checkbox for automatic history export
document.getElementById("autoExport").addEventListener("change", function() {
    // Save the state of the checkbox
    chrome.storage.sync.set({autoExport: this.checked});

  // Check if the checkbox is checked
  if (this.checked) {
    // Get the selected rate
    var rate = document.getElementById("rate").value;

    // Start automatic history export
    autoExportHistory(rate);
  }
});

// Retrieve the saved state of the checkbox
chrome.storage.sync.get("autoExport", function(data) {
  // Get the checkbox element
  var autoExportCheckbox = document.getElementById("autoExport");

  // Set the value of the checkbox
  autoExportCheckbox.checked = data.autoExport;

  // Trigger the change event if the checkbox is checked
  if (data.autoExport) {
    autoExportCheckbox.dispatchEvent(new Event("change"));
  }
});

function autoExportHistory(rate) {
  var interval;
  switch (rate) {
    case "Daily":
      interval = 0.1 * 60 * 60 * 1000;
      console.log(interval);
      break;
    case "Weekly":
      interval = 7 * 24 * 60 * 60 * 1000;
      break;
    case "Monthly":
      interval = 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      console.error("Invalid rate");
      return;
  }


  
 /*  setInterval(function() {
    exportHistory("csv");
    console.log("Exporting "+ interval);
  }, interval); */
}

  // Function to export history in the specified format
function exportHistory(format) {
    // Get the selected history length
    var length = document.getElementById("length").value;
  
    // Calculate the start time based on the selected history length
    var startTime;
    if (length === "all") {
      startTime = 0;
    } else {
      startTime = (new Date()).getTime() - (length * 24 * 60 * 60 * 1000);
    }
  
    // Get the user's browsing history
    chrome.history.search({text: "", startTime: startTime}, function(historyItems) {
      // Convert the history data to the specified format
      var data;
      if (format === "csv") {
        data = convertToCSV(historyItems);
        var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
      } else if (format === "json") {
        data = JSON.stringify(historyItems);
        var blob = new Blob([data], {type: "application/json;charset=utf-8"});
      } else if (format === "txt") {
        data = convertToTXT(historyItems);
        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      }
  
      // Download the data as a file
      var url = URL.createObjectURL(blob);
      chrome.downloads.download({url: url, filename: "history." + format});
    });
  }
  
  // Function to convert history data to CSV format
  function convertToCSV(historyItems) {
    var csv = "URL,Title,Last Visit Time,Visit Count \n";
    for (var i = 0; i < historyItems.length; i++) {
      var item = historyItems[i];
      csv += item.url + "," + item.title + "," + new Date(item.lastVisitTime) + "," + item.visitCount + "\n";
    }
    return csv;
  }
  
  // Function to convert history data to TXT format
  function convertToTXT(historyItems) {
    var txt = "";
    for (var i = 0; i < historyItems.length; i++) {
      var item = historyItems[i];
      txt += "URL: " + item.url + "\n";
      txt += "Title: " + item.title + "\n";
      txt += "Last Visit Time: " + new Date(item.lastVisitTime) + "\n";
      txt += "Visit Count: " + item.visitCount + "\n";
      txt += "\n";
    }
    return txt;
  }






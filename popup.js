let originalTabId;
window.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const dataElement = document.getElementById("data");
  const statusElement = document.getElementById("status");
  originalTabId = tab.id;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractData,
  }, (results) => {
    if (chrome.runtime.lastError) {
      statusElement.innerText = "Error extracting data.";
      statusElement.classList.add("error");
      console.error(chrome.runtime.lastError);
      return;
    }

    const extractedData = results[0]?.result;
    if (extractedData) {
      // Display the extracted data
      dataElement.innerText = extractedData;
      // Copy to clipboard
      navigator.clipboard.writeText(extractedData).then(() => {
        // Update status to success
        statusElement.innerText = "Data has been copied to clipboard.";
        statusElement.classList.add("success");
        statusElement.classList.remove("error");

        // Redirect to the Google Sheets tab or open it
        redirectToGoogleSheets();
      }).catch((err) => {
        statusElement.innerText = "Failed to copy data.";
        statusElement.classList.add("error");
        statusElement.classList.remove("success");
        console.error("Failed to copy:", err);
      });
    } else {
      statusElement.innerText = "No data found.";
      statusElement.classList.add("error");
      statusElement.classList.remove("success");
    }
  });
});

function extractData() {
  // Extract the location (e.g., "ANCHORAGE, AK")
  const locationElement = document.querySelector(".ui.large.inverted.header .sub.header");
  let state = "Location not found";
  
  if (locationElement) {
    const location = locationElement.innerText.trim();
    const parts = location.split(","); // Split by comma
    if (parts.length > 1) {
      state = parts[1].trim(); // Get the second part (state abbreviation)
    }
  }

  // Find the truck or tractor count
  const truckOrTractorElement = Array.from(document.querySelectorAll(".ui.large.orange.label")).find((element) => {
    const keyElement = element.querySelector(".key");
    return keyElement && (keyElement.innerText.trim() === "Trucks" || keyElement.innerText.trim() === "Tractors");
  });

  // Extract the count value if found
  const count = truckOrTractorElement ? truckOrTractorElement.querySelector(".value").innerText.trim() : "Count not found";

  function getTextByLabel(label) {
    const elements = document.querySelectorAll("div");
    for (const element of elements) {
      if (element.innerText.trim() === label) {
        const nextElement = element.nextElementSibling;
        if (nextElement && nextElement.tagName === "DIV") {
          return nextElement.innerText.trim();
        }
      }
    }
    return "";
  }

  let name = getTextByLabel("Name");
  let mcNumber = getTextByLabel("MC/MX/FF");
  let contactName = getTextByLabel("Contact Name").split(",")[0].trim(); // Capture only the part before any comma
  const phone = getTextByLabel("Phone");

  
  return `${contactName}, ${name}, ${mcNumber},${state}-${count}, ${phone}`;
}

function redirectToGoogleSheets() {
  // Query for any Google Sheets tab using broader URL patterns
  chrome.tabs.query({ url: ["*://docs.google.com/spreadsheets/*", "*://*.google.com/spreadsheets/*"] }, (tabs) => {
    if (tabs.length > 0) {
      // Activate the first Google Sheets tab found
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      // Display an error message in the popup if no matching tab is found
      const statusElement = document.getElementById("status");
      statusElement.innerText = "No open Google Sheets tab found.";
      statusElement.classList.add("error");
      statusElement.classList.remove("success");
    }
  });
  if (originalTabId) {
    chrome.tabs.remove(originalTabId);
  }
}




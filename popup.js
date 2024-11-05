let originalTabId;

window.addEventListener("DOMContentLoaded", async () => {
  // Store the ID of the original tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  originalTabId = tab.id;
  
  const dataElement = document.getElementById("data");
  const statusElement = document.getElementById("status");

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
      dataElement.innerText = extractedData;
      
      navigator.clipboard.writeText(extractedData).then(() => {
        statusElement.innerText = "Data has been copied to clipboard.";
        statusElement.classList.add("success");
        statusElement.classList.remove("error");

        // Redirect to Google Sheets and close the original tab
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

  // Extract data and ensure only the first part before a comma is captured
  let name = getTextByLabel("Name").split(",")[0].trim(); // Capture only the part before any comma
  let mcNumber = getTextByLabel("MC/MX/FF");
  let contactName = getTextByLabel("Contact Name").split(",")[0].trim(); // Capture only the part before any comma
  const phone = getTextByLabel("Phone");

  // Format the extracted data as comma-separated values
  return `${contactName}, ${name}, ${mcNumber}, ${phone}`;
}


function redirectToGoogleSheets() {
  chrome.tabs.query({ url: ["*://docs.google.com/spreadsheets/*", "*://*.google.com/spreadsheets/*"] }, (tabs) => {
    if (tabs.length > 0) {
      // Activate the first Google Sheets tab found
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      const statusElement = document.getElementById("status");
      statusElement.innerText = "No open Google Sheets tab found.";
      statusElement.classList.add("error");
      statusElement.classList.remove("success");
    }

    // Close the original tab after redirect
    if (originalTabId) {
      chrome.tabs.remove(originalTabId);
    }
  });
}
window.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
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
  const contactName = getTextByLabel("Contact Name");
  const phone = getTextByLabel("Phone");

  if (name.includes(",")) {
    name = name.split(",")[0].trim();
  }
  if (mcNumber.includes(",")) {
    mcNumber = mcNumber.split(",")[0].trim();
  }

  return `${contactName}, ${name}, ${mcNumber}, ${phone}`;
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
}




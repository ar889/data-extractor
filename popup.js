document.getElementById("extract").addEventListener("click", async () => {
  // Run the script to extract data on the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractData,
  });
});

function extractData() {
  // Helper function to find a div with specific label text and get the next sibling's text
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

  // Extract data
  const name = getTextByLabel("Name");
  const mcNumber = getTextByLabel("MC/MX/FF");
  const contactName = getTextByLabel("Contact Name");
  const phone = getTextByLabel("Phone");

  // Format data as comma-separated values
  const extractedData = `${contactName},${name},${mcNumber},${phone}`;

  // Send the formatted data to the popup
  chrome.runtime.sendMessage({ data: extractedData });
}

// Listen for the message in popup.js and display the extracted data in a copyable format
chrome.runtime.onMessage.addListener((request) => {
  if (request.data) {
    document.getElementById("status").innerText = request.data;
  }
});

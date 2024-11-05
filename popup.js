document.getElementById("extract").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractData,
  });
});

document.getElementById("copy").addEventListener("click", () => {
  const textToCopy = document.getElementById("status").innerText;
  const copyButton = document.getElementById("copy");

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Change button text and color to indicate success
      copyButton.innerText = "Copied!";
      copyButton.classList.add("copied");

      // Revert text and color after a delay
      setTimeout(() => {
        copyButton.innerText = "Copy to Clipboard";
        copyButton.classList.remove("copied");
      }, 2000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  }
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

  const name = getTextByLabel("Name");
  const mcNumber = getTextByLabel("MC/MX/FF");
  const contactName = getTextByLabel("Contact Name");
  const phone = getTextByLabel("Phone");

  const extractedData = `${contactName},${name},${mcNumber},${phone}`;
  chrome.runtime.sendMessage({ data: extractedData });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.data) {
    document.getElementById("status").innerText = request.data;
  }
});

# Data Scraper by AR

A Google Chrome extension that extracts specific data from a webpage and saves it to Google Sheets. This tool simplifies the process of gathering structured information from web pages and automatically copies the extracted data to your clipboard for easy pasting.

---
## Important notice
This extension is for brokersnapshot.com only
## Features

- **Efficient Data Extraction**:
  - Retrieves location, truck or tractor count, name, MC/MX/FF number, contact name, and phone number from webpages.
- **Clipboard Integration**:
  - Automatically copies the extracted data to your clipboard.
- **Google Sheets Support**:
  - Searches for an open Google Sheets tab to paste the data or alerts the user if no Sheets tab is found.
- **User-friendly UI**:
  - Displays extraction status and feedback in a clean, styled popup.

---

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load unpacked** and select the downloaded folder.
5. The extension will now be available in your browser.

---

## Usage

1. Navigate to a webpage with the required data.
2. Click on the **Data Scraper by AR** extension icon.
3. Wait for the extraction process to complete:
   - Data will be displayed in the popup.
   - Automatically copied to your clipboard.
4. If a Google Sheets tab is open, it will be activated for you to paste the data. If not, an error will notify you.

---

## Technical Details

### Manifest
The extension uses **Manifest V3** and requires the following permissions:
- `activeTab`, `scripting`, `tabs`, `clipboardWrite`

### Popup Interface
- **HTML and CSS**: Simple UI for showing the extracted data and status messages.
- **JavaScript**: Handles the logic for data extraction, clipboard copying, and tab management.

### Data Extraction Logic
- Extracts:
  - Location and state abbreviation.
  - Truck or tractor count.
  - Name, MC/MX/FF number, contact name, and phone.
- Handles dynamic webpage elements using the `querySelector` and DOM traversal.

---

## Files

- **manifest.json**: Extension configuration.
- **popup.html**: The UI for the popup.
- **popup.js**: The script for data extraction and user interaction.

---

## Feedback & Contributions

Feel free to submit issues or pull requests to improve the extension.

---

Start extracting data efficiently with **Data Scraper by AR**! 🎉

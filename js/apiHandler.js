import { apiUrl, staticDataUrl, productsSectionId, loadingPageId } from './constants.js';

// This asynchronous function fetches data from a specified URL using the fetch API.
// Parameters:
// - url: The URL from which to fetch the data.
// Returns:
// - A promise that resolves to the fetched data.
export async function fetchData(url) {
    try {
        // Perform a fetch request to the specified URL
        const response = await fetch(url);

        // Check if the response status is ok (status code 2xx)
        if (!response.ok) {
            // If not ok, throw an error with the response status
            throw new Error(`Request error: ${response.status}`);
        }

        // Parse the response body as JSON
        const data = await response.json();

        // Return the parsed data
        return data;
    } catch (error) {
        // If an error occurs during the fetch or parsing, throw a new error with the error message
        throw new Error(`Request error: ${error.message}`);
    }
}

// This asynchronous function performs actions on the DOM, fetches data using fetchData,
// and returns the fetched data.
// Returns:
// - A promise that resolves to the fetched data.
async function getData() {
    // Disable scrolling on the body element
    document.body.style.overflow = "hidden";

    // Get references to DOM elements
    const catalogSection = document.getElementById(productsSectionId);
    const loadingDiv = document.getElementById(loadingPageId);
    
    let data;

    try {
        // Attempt to fetch data from the API URL (apiUrl)
        data = await fetchData(apiUrl);
    } catch (error) {
        // If there's an error, fetch data from the static data URL (staticDataUrl)
        data = await fetchData(staticDataUrl);
    }

    // Display the catalog section and hide the loading div
    catalogSection.style.display = "flex";
    loadingDiv.style.display = "none";

    // Enable scrolling on the body element
    document.body.style.overflow = "auto";

    // Return the fetched data
    return data;
}

export { getData }
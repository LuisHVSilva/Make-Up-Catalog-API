import { dataBrand, dataProductType, dataRating, dataPrice, dataName, productItemClass, productsSectionId, ratingFilter, priceLowFilter, priceHighFilter, azFilter, zaFilter } from './constants.js';

// Function to filter products based on applied filters
// Parameters:
// - appliedFilters: An array of filter objects containing dataProperty and selectedOption properties.
// - productsElements: A collection of product elements to be filtered.
// Returns:
// - An array of product elements that match all applied filters.
function filterProductsByAppliedFilters(appliedFilters, productsElements) {
    // Define a cumulative filter function
    const cumulativeFilter = function (product) {
        // Check if every applied filter is satisfied for the current product
        return appliedFilters.every(function (filter) {
            // If a filter has a selected option, check if it matches the product's attribute value
            if (filter.selectedOption) {
                return product.getAttribute(filter.dataProperty) === filter.selectedOption;
            }
            // If no selected option, consider the filter as satisfied
            return true;
        });
    };

    // Use the cumulative filter function to filter the products
    return Array.from(productsElements).filter(cumulativeFilter);
}


// Function to show all products by setting their display property to 'flex'
// Parameters:
// - productsElements: A collection of product elements to be displayed.
// Returns:
// - None
function showAllProducts(productsElements) {
    // Loop through each product element in the collection
    productsElements.forEach(function (product) {
        // Set the display property to 'flex' to make the product visible
        product.style.display = 'flex';
    });
}

// Function to hide all products by setting their display property to 'none'
// Parameters:
// - productsElements: A collection of product elements to be hidden.
// Returns:
// - None
function hideAllProducts(productsElements) {
    // Loop through each product element in the collection
    productsElements.forEach(function (product) {
        // Set the display property to 'none' to hide the product
        product.style.display = 'none';
    });
}

class ProductFilter {
    // Initializes instance properties such as selectedOption, dataProperty, productsElements, productsContainer, and appliedFilters.
    constructor({ selectedOption = "", dataProperty = "" }) {
        this.selectedOption = selectedOption;
        this.dataProperty = dataProperty;

        this.productsElements = document.querySelectorAll(`.${productItemClass}`);
        this.productsContainer = document.getElementById(productsSectionId);
        this.appliedFilters = [];
    }

    // Represents default applied filters. This is a static property shared among all instances of the class.
    static appliedFilters = [{ dataProperty: dataBrand, selectedOption: "" }, { dataProperty: dataProductType, selectedOption: "" }];

    // Method to handle the selection of filters and update displayed products
    selectFilter() {
        // Check if the selected option is empty
        if (this.selectedOption.length === 0) {
            // If empty, show all products, clear applied filters, and return
            showAllProducts(this.productsElements);
            this.appliedFilters.length = 0;
            return;
        }

        // Remove any existing filter for the same dataProperty from appliedFilters array
        this.appliedFilters = this.appliedFilters.filter((filter) => {
            return filter.dataProperty !== this.dataProperty;
        });

        // Update appliedFilters based on the selected option and dataProperty
        if (this.dataProperty == dataBrand) {
            ProductFilter.appliedFilters[0].selectedOption = this.selectedOption;
        }

        if (this.dataProperty == dataProductType) {
            ProductFilter.appliedFilters[1].selectedOption = this.selectedOption;
        }

        // Hide all products
        hideAllProducts(this.productsElements);

        // Filter products based on updated appliedFilters
        const filteredProducts = filterProductsByAppliedFilters(ProductFilter.appliedFilters, this.productsElements);

        // Display filtered products
        filteredProducts.forEach((product) => {
            product.style.display = 'flex';
        });
    }

    // Method to filter products by name and update their visibility
    filterProductsByName(name) {
        // Loop through each product element in the productsElements collection
        this.productsElements.forEach((item) => {
            // Get the name attribute of the current product and convert it to lowercase
            const itemName = item.getAttribute(this.dataProperty).toLowerCase();

            // Check if the product name includes the filter name
            const isVisible = itemName.includes(name);

            // Set the display property of the product based on its visibility
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }

    // Method to sort products based on the specified sort type
    sortProducts(sortType) {
        // Convert the productsElements NodeList to an array for sorting
        const productElementsArray = Array.from(this.productsElements);

        // Perform sorting based on the selected sortType
        if (sortType == ratingFilter) {
            // Sort by rating in descending order
            productElementsArray.sort((a, b) => {
                const valueA = parseFloat(a.getAttribute(dataRating)) || 0;
                const valueB = parseFloat(b.getAttribute(dataRating)) || 0;
                return valueB - valueA;
            });
        }

        if (sortType == priceLowFilter) {
            // Sort by price in ascending order
            productElementsArray.sort((a, b) => {
                const valueA = parseFloat(a.getAttribute(dataPrice)) || 0;
                const valueB = parseFloat(b.getAttribute(dataPrice)) || 0;
                return valueA - valueB;
            });
        }

        if (sortType == priceHighFilter) {
            // Sort by price in descending order
            productElementsArray.sort((a, b) => {
                const valueA = parseFloat(a.getAttribute(dataPrice)) || 0;
                const valueB = parseFloat(b.getAttribute(dataPrice)) || 0;
                return valueB - valueA;
            });
        }

        if (sortType == azFilter) {
            // Sort alphabetically from A to Z based on product name
            productElementsArray.sort((a, b) => {
                const valueA = a.getAttribute(dataName);
                const valueB = b.getAttribute(dataName);
                return valueA.localeCompare(valueB);
            });
        }

        if (sortType == zaFilter) {
            // Sort alphabetically from Z to A based on product name
            productElementsArray.sort((a, b) => {
                const valueA = a.getAttribute(dataName);
                const valueB = b.getAttribute(dataName);
                return valueB.localeCompare(valueA);
            });
        }

        // Clear the productsContainer's HTML content
        this.productsContainer.innerHTML = "";

        // Append the sorted product elements to the productsContainer
        productElementsArray.forEach((product) => {
            this.productsContainer.appendChild(product);
        });
    }


    // Method to clean/reset filters and update displayed products
    cleanFilter(button, inputName, sortName, filterBrand, filterTyped) {
        // Add a click event listener to the specified button
        button.addEventListener('click', () => {
            // Show all products
            showAllProducts(this.productsElements);

            // Reset input values to default or empty
            inputName.value = "";
            sortName.value = azFilter;
            filterBrand.value = "";
            filterTyped.value = "";

            // Sort products by the default A-Z criterion
            this.sortProducts(azFilter);
        });
    }
}

export default ProductFilter;

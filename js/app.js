// main.js
import { getData } from './apiHandler.js';
import { azFilter, priceConversion, priceRounding, productItemClass, hiddenInfoId, dataName, dataBrand, dataPrice, dataRating, dataProductType, filterBrand, filterType, filterName, filterSortType, cleanFilter, productsSectionId } from './constants.js';
import ProductFilter from './ProductFilter.js';

// This function formats a given number as a price, considering a conversion factor and rounding precision.
// Parameters:
// - number: The input number to be formatted as a price.
// Returns:
// - A formatted price as a string.
function priceFormat(number) {
    // Check if the input number is undefined or an empty string
    if (number === undefined || number === '') {
        // Return a default value of 0.00 if the input is invalid
        return 0.00;
    }

    // Convert the input number to a floating-point value and apply a conversion factor
    var float = (parseFloat(number) * priceConversion);

    // Format the resulting float with the specified rounding precision and return as a string
    return float.toFixed(priceRounding);
}

// This function handles the click event on a product item, toggling the visibility of hidden information.
// Parameters:
// - event: The click event object.
function handleProductItemClick(event) {
    // Find the closest ancestor element with the specified class to the clicked target
    const target = event.target.closest(`.${productItemClass}`);

    // Check if a valid target element is found
    if (target) {
        // Find the hidden information element within the target element using its ID
        const hiddenInfo = target.querySelector(`#${hiddenInfoId}`);

        // Toggle the visibility of the hidden information by changing its bottom position
        // If the current bottom position is not "0%", set it to "0%", otherwise set it to "-100%"
        hiddenInfo.style.bottom = hiddenInfo.style.bottom !== "0%" ? "0%" : "-100%";
    }
}

// This function populates a <select> element with options based on the provided values array,
// and adds an event listener to handle changes in the selected option.
// Parameters:
// - divId: The ID of the <select> element to be populated.
// - values: An array of values to be used as options in the <select> element.
// - dataProperty: A data property to be used in the event listener.
function populateSelectWithOptions(divId, values, dataProperty) {
    // Get the <select> element by its ID
    var selectId = document.getElementById(divId);

    // Iterate through the values array to create options and add them to the <select> element
    values.forEach(function (item) {
        var option = document.createElement("option");

        // Set the value and text of the option to the current item in the array
        option.value = item;
        option.text = item;

        // Append the option to the <select> element
        selectId.appendChild(option);
    });

    // Add an event listener to the <select> element to handle changes in the selected option
    selectId.addEventListener('change', function (event) {
        // Get the selected option value
        const selectedOption = event.target.value;

        // Create a new ProductFilter instance with the selected option and data property
        const productFilter = new ProductFilter({ selectedOption: selectedOption, dataProperty: dataProperty });

        // Call the selectFilter method of the productFilter instance
        productFilter.selectFilter();
    });

    // Return the <select> element
    return selectId;
}

// Get data from the asynchronous getData function
const data = await getData();

// Get the number of objects in the data
var numberOfDivs = Object.keys(data).length;

// Get a reference to the container element where the dynamically created elements will be appended
var container = document.getElementById(productsSectionId);

// Initialize sets to store unique brand and product type values
const brandList = new Set();
const productTypeList = new Set();

// Loop through the data objects and create HTML elements dynamically
for (var i = 0; i < numberOfDivs; i++) {
    // Extract relevant properties from the current data object
    const name = data[i].name ? data[i].name : "Sem nome";
    const image = data[i].api_featured_image ? data[i].api_featured_image : '../img/unavailable.png';
    const brand = data[i].brand ? data[i].brand : "Sem marca";
    const price = priceFormat(data[i].price);
    const rating = data[i].rating ? data[i].rating : 0;
    const category = data[i].category ? data[i].category : "Sem Categoria";
    const productType = data[i].product_type ? data[i].product_type : "Sem tipo";

    // Add unique brand and product type values to the respective sets
    brandList.add(brand);
    productTypeList.add(productType);

    // Create a new <div> element and set its attributes
    var newDiv = document.createElement("div");
    newDiv.classList.add(productItemClass);
    newDiv.setAttribute(dataName, name);
    newDiv.setAttribute(dataBrand, brand);
    newDiv.setAttribute(dataPrice, price);
    newDiv.setAttribute(dataRating, rating);
    newDiv.setAttribute(dataProductType, productType);

    // Creates the general scope of the HTML div that will be applied to all API products
    const divScope = `<div class="image">
                            <img src="${image}"
                                alt="${name}">
                        </div>

                        <div class="bottom-infos">
                            <p class="name">${name}</p>
                            <div>
                                <p class="brand">${brand}</p>
                                <p class="price">R$ ${price}</p>
                            </div>
                        </div>


                        <div id="hidden-info" class="click-infos">
                            <div class="infos">
                                <div class="info">
                                    <span>Marca:</span>
                                    <p>${brand}</p>
                                </div>
                                <div class="info">
                                    <span>Preço:</span>
                                    <p>R$ ${price}</p>
                                </div>
                                <div class="info">
                                    <span>Avaliação:</span>
                                    <p>${rating}</p>
                                </div>
                                <div class="info">
                                    <span>Categoria:</span>
                                    <p>${category}</p>
                                </div>
                                <div class="info">
                                    <span>Tipo:</span>
                                    <p>${productType}</p>
                                </div>
                            </div>
                      </div>`

    // Set the innerHTML property of the newDiv with the content from divScope
    newDiv.innerHTML = divScope;

    // Append the newDiv element to the container
    container.appendChild(newDiv);
}

const initialSortProducts = new ProductFilter({});
initialSortProducts.sortProducts(azFilter);

// Add a click event listener to the container element to handle product item clicks
container.addEventListener('click', handleProductItemClick);

// Populate the filterBrand select element with options from the brandList set
const filterBrandElement = populateSelectWithOptions(filterBrand, Array.from(brandList), dataBrand);

// Populate the filterType select element with options from the productTypeList set
const filterTypeElement = populateSelectWithOptions(filterType, Array.from(productTypeList), dataProductType);


// ** NAME FILTER
// Get the filterNameInput element by its ID
const filterNameInput = document.getElementById(filterName);

// Create a new instance of the ProductFilter class with the dataProperty set to dataName
const productFilterName = new ProductFilter({ dataProperty: dataName });

// Add an 'input' event listener to the filterNameInput
filterNameInput.addEventListener('input', function () {
    // Get the trimmed and lowercase value from the input field
    const filterValue = filterNameInput.value.trim().toLowerCase();

    // Call the filterProductsByName method of the productFilterName instance
    // to filter the products based on the input value
    productFilterName.filterProductsByName(filterValue);
});

// ** SORT FILTER
// Get the sortTypeSelect element by its ID
const sortTypeSelect = document.getElementById(filterSortType);

// Create a new instance of the ProductFilter class with no specific data property
const productFilterSort = new ProductFilter({});

// Add a 'change' event listener to the sortTypeSelect
sortTypeSelect.addEventListener('change', function () {
    // Get the selected value from the sortTypeSelect
    const selectedSortType = sortTypeSelect.value;

    // Call the sortProducts method of the productFilterSort instance
    // to sort the products based on the selected sort type
    productFilterSort.sortProducts(selectedSortType);
});


// ** CLEAN FILTER
// Get the Clean Filters button by its ID
const cleanButton = document.getElementById(cleanFilter);

// Create a new instance of the ProductFilter class with no specific data property
const cleanFilters = new ProductFilter({});

// Call the cleanFilter method of the cleanFilters instance
// to associate the cleaning functionality with the Clean Filters button
cleanFilters.cleanFilter(cleanButton, filterNameInput, sortTypeSelect, filterBrandElement, filterTypeElement);
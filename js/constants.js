const priceConversion = 5.5;
const priceRounding = 2;


const productItemClass = "product-item";
const hiddenInfoId = "hidden-info";
const productsSectionId = "catalog";
const loadingPageId = "loading-page";

const cleanFilter = 'clean-filter';

const dataName = "data-name";
const dataBrand = "data-brand";
const dataPrice = "data-price";
const dataRating = "data-rating";
const dataProductType = "data-product-type";

const ratingFilter = "rating";
const priceLowFilter = "price-low";
const priceHighFilter = "price-high";
const azFilter = "az";
const zaFilter = "za";

const filterBrand = "filter-brand";
const filterType = "filter-type";
const filterName = "filter-name";
const filterSortType = "sort-type";

const apiUrl = 'http://makeup-api.herokuapp.com/api/v1/products.jsons';
const staticDataUrl = './data/products.json';

export { priceConversion, priceRounding, productItemClass, hiddenInfoId, dataName, dataBrand, dataPrice, dataRating, dataProductType, filterBrand, filterType, filterName, filterSortType, cleanFilter, productsSectionId, apiUrl, staticDataUrl, loadingPageId, ratingFilter, priceLowFilter, priceHighFilter, azFilter, zaFilter };
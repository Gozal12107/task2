// API endpoint for fetching products
const API_URL = 'https://dummyjson.com/products';

// DOM elements
const productsList = document.getElementById('products-list');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');

// Global product data
let products = [];

var productCount = 0;

// Function to update count and display
function incrementCount() {
    productCount += 10;
    document.getElementById('countDisplay').innerText = 'Products showed: ' + productCount;
    fetchProducts();
}
// Bind the function to the button click event
document.getElementById('incrementButton').addEventListener('click', incrementCount);




function decrementCount() {
    productCount -= 10;
    document.getElementById('countDisplay').innerText = 'Products showed: ' + productCount;
    fetchProducts();
}
// Bind the function to the button click event
document.getElementById('decrementButton').addEventListener('click', decrementCount);



async function fetchProducts() {
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=10&skip=${productCount}`)
      console.log(productCount)
      const data = await response.json()
      console.log(data);
      products = data.products
    } catch (error) {
      console.error(error)
    }

    renderProducts(products);
    addCategoryOptions();
}

function renderProducts(products) {
    // Clear existing content
    productsList.innerHTML = '';

    function showProductDetails(product) {
        const productDetailWindow = window.open('', '_blank');
        if (productDetailWindow) {
          // Use the product object passed as argument
          productDetailWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Product Details</title>
            <link rel="stylesheet" href="styles.css">
            </head>
            <body>
            <div class="product-detail-container">
                <h2 class="product-detail-title">${product.title}</h2>
                <div class="product-image-container">
                ${product.images.map(image => `<img src="${image}" alt="${product.title}">`).join('')}
                </div>
                <p class="product-detail-price">
                $${product.price}
                ${product.discountPercentage > 0 ? `<span class="discount-detail">(${product.discountPercentage}% off)</span>` : ''}
                </p>
                <p class="product-detail-category">Category: ${product.category}</p>
                <p class="product-detail-stock">Stock: ${product.stock}</p>
            </div>
            </body>
            </html>
          `);
        } else {
          alert('Please allow pop-ups to view product details.');
        }
      } 
  
    // Loop through products and create product elements
    products.forEach((product) => {
      const productItem = document.createElement('div');
    //   productItem.classList.add('product-container');
  
      // Create and append product information to the element
      const productContent = `
        <div class="product-container">
            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price}${product.discountPercentage > 0 ? `<span class="discount">(${product.discountPercentage}% off)</span>` : ''}</p>
            <p class="product-info">Category: ${product.category}</p>
            <p class="product-info">Stock: ${product.stock}</p>
            <a href="#" class="view-details">View Details</a>
        </div>
  
      `;
      productItem.innerHTML = productContent;
  
      // Add click event listener to view details link
      productItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        // Pass the product object to showProductDetails
        showProductDetails(product);
      });
  
      // Append product item to the products list
      productsList.appendChild(productItem);
    });
}

function addCategoryOptions() {
    const categories = new Set();
    for (const product of products) {
      categories.add(product.category);
    }
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerText = category;
      categoryFilter.appendChild(option);
    });
  }
  
searchBar.addEventListener('keyup', function() {
    const keyword = this.value.toLowerCase();
    const filteredProducts = products.filter(product => {
      return product.title.toLowerCase().includes(keyword) ||
             product.description.toLowerCase().includes(keyword) ||
             product.category.toLowerCase().includes(keyword);
    });
    renderProducts(filteredProducts);
});
  
categoryFilter.addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory === 'all') {
      renderProducts(products);
    } else {
      const filteredProducts = products.filter(product => product.category === selectedCategory);
      renderProducts(filteredProducts);
    }

});

fetchProducts();
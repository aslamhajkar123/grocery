document.addEventListener("DOMContentLoaded", function() {
    function updateCartCount() {
        console.log("Updating cart count...");
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = getCurrentCartQuantity();
        }
    }
    updateCartCount(); 
    const searchBar = document.querySelector('.search-bar');
    const productCards = document.querySelectorAll('.product-card');
    const filterCheckboxes = document.querySelectorAll('.filter-button-group input[type="checkbox"]');
    const filterButtons = document.querySelectorAll('.filter-button-label');
    const clearFiltersButton = document.querySelector('.clear-filters');
    const applyFiltersButton = document.querySelector('.apply-filters');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const productCategories = document.querySelectorAll('.product-category');

    console.log("Search Bar Element:", searchBar);
    console.log("Product Cards:", productCards);
    console.log("Filter Checkboxes:", filterCheckboxes);
    console.log("Filter Buttons:", filterButtons);
    console.log("Clear Filters Button:", clearFiltersButton);
    console.log("Apply Filters Button:", applyFiltersButton);
    console.log("Min Price Input:", minPriceInput);
    console.log("Max Price Input:", maxPriceInput);
    console.log("Product Categories:", productCategories);

    function getCategoryName(filterValue) {
        const categoryMap = {
            "Fruits": "Fruits",
            "Vegetables": "Vegetables",
            "Canned Goods": "Canned Goods",
            "Dairy": "Dairy",
            "Meat": "Meat",
            "Fish & Seafood": "Fish & Seafood",
            "Deli": "Deli",
            "Condiments & Spices": "Condiments & Spices",
            "Snacks": "Snacks",
            "Bread & Bakery": "Bread & Bakery",
            "Beverages": "Beverages",
            "Pasta, Rice & Cereal": "Pasta, Rice & Cereal",
            "Baking": "Baking",
            "Frozen Foods": "Frozen Foods",
            "Personal Care": "Personal Care",
            "Health Care": "Health Care",
            "Household & Cleaning Supplies": "Household & Cleaning Supplies",
            "Baby Items": "Baby Items",
            "Pet Care": "Pet Care"
        };
        return categoryMap[filterValue] || null;
    }

    function filterProducts() {
        const searchTerm = searchBar ? searchBar.value.toLowerCase() : '';
        const selectedFilters = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value.toLowerCase());

        const minPrice = parseFloat(minPriceInput ? minPriceInput.value : '') || 0;
        const maxPrice = parseFloat(maxPriceInput ? maxPriceInput.value : '') || Infinity;

        console.log("Filtering - Search Term:", searchTerm, "Selected Filters:", selectedFilters, "Min Price:", minPrice, "Max Price:", maxPrice);

        
        productCards.forEach(card => {
            card.style.display = 'none';
        });

        
        productCategories.forEach(categorySection => {
            categorySection.style.display = 'none';
        });

        const visibleCategories = new Set(); // Keep track of categories with visible products

        productCards.forEach(card => {
            const productNameElement = card.querySelector('h3');
            const productName = productNameElement ? productNameElement.textContent.toLowerCase() : '';
            const categoryElement = card.querySelector('.category');
            const category = categoryElement ? categoryElement.textContent.trim().toLowerCase() : '';
            const priceElement = card.querySelector('.price');
            const price = priceElement ? parseFloat(priceElement.textContent.replace('₹', '')) : 0;

            const matchesSearch = productName.includes(searchTerm) || category.includes(searchTerm);
            const matchesCategory = selectedFilters.length === 0 || selectedFilters.some(filter => filter === category);
            const matchesPriceRange = price >= minPrice && price <= maxPrice;

            const shouldDisplay = matchesSearch && matchesCategory && matchesPriceRange;
            card.style.display = shouldDisplay ? 'flex' : 'none';

            if (shouldDisplay && categoryElement) {
                const categoryHeadingText = getCategoryName(categoryElement.textContent.trim());
                if (categoryHeadingText) {
                    visibleCategories.add(categoryHeadingText);
                }
            }
        });

                productCategories.forEach(categorySection => {
            const h3Element = categorySection.querySelector('h3');
            if (h3Element && visibleCategories.has(h3Element.textContent.trim())) {
                categorySection.style.display = 'block';
            } else {
                categorySection.style.display = 'none';
            }
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', function() {
            console.log("Search input changed. Value:", this.value);
            filterProducts(); // Apply search filter immediately
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
             const correspondingCheckbox = document.getElementById(filterValue.toLowerCase().replace(/ /g, '-')); // Adjust ID selector
            if (correspondingCheckbox) {
                correspondingCheckbox.checked = !correspondingCheckbox.checked;
                this.classList.toggle('active', correspondingCheckbox.checked);
                console.log("Filter button clicked. Filter:", filterValue, "Checked:", correspondingCheckbox.checked);
                           }
        });
    });

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function() {
            console.log("Apply Filters button clicked.");
            filterProducts(); 
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', function() {
            console.log("Clear Filters button clicked.");
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            filterButtons.forEach(button => button.classList.remove('active'));
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            filterProducts();         });
    }

    // Initially show all product categories
    productCategories.forEach(categorySection => {
        categorySection.style.display = 'block';
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart'); // Select buttons with the class 'add-to-cart'

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            const productImage = this.dataset.image;
            const productId = productName.toLowerCase().replace(/\s+/g, '-');

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };

            console.log('Adding to cart:', product);

            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount(); 
            alert(`${productName} added to cart!`); // Optional: Provide feedback
        });
    });
});

function getCurrentCartQuantity() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}
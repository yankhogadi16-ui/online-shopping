document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
});

let allProducts = [];

async function fetchContent() {
    try {
        const response = await fetch('http://localhost:3000/api/content');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // General text elements
        const updateText = (id, text) => {
            const el = document.getElementById(id);
            if (el && text) el.innerText = text;
        };

        updateText('doc-title', data.siteTitle);
        updateText('site-title', data.siteTitle);
        updateText('hero-title', data.heroTitle);
        updateText('hero-subtitle', data.heroSubtitle);
        updateText('footer-text', data.footerText);

        // Categories
        const catContainer = document.getElementById('categories-container');
        if (catContainer && data.categories) {
            catContainer.innerHTML = '';
            
            // "All" Category
            const allCard = document.createElement('div');
            allCard.className = 'category-card';
            allCard.style.cursor = 'pointer';
            allCard.innerHTML = `<h3>All</h3>`;
            allCard.addEventListener('click', () => filterProducts(''));
            catContainer.appendChild(allCard);

            data.categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'category-card';
                card.style.cursor = 'pointer';
                card.innerHTML = `<h3>${cat.name}</h3>`;
                card.addEventListener('click', () => filterProducts(cat.name));
                catContainer.appendChild(card);
            });
        }

        // Store products globally for filtering
        if (data.products) {
            allProducts = data.products;
            renderProducts(allProducts);
        }

        // Features
        const featContainer = document.getElementById('features-container');
        if (featContainer && data.features) {
            featContainer.innerHTML = '';
            data.features.forEach(feat => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h3>${feat.title}</h3>
                    <p>${feat.description}</p>
                `;
                featContainer.appendChild(div);
            });
        }

        // Search Form Logic
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const term = document.getElementById('search-input').value.toLowerCase();
                const filtered = allProducts.filter(p => 
                    p.title.toLowerCase().includes(term) || 
                    (p.category && p.category.toLowerCase().includes(term))
                );
                renderProducts(filtered);
            });
            
            // Optional live search
            document.getElementById('search-input').addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = allProducts.filter(p => 
                    p.title.toLowerCase().includes(term) || 
                    (p.category && p.category.toLowerCase().includes(term))
                );
                renderProducts(filtered);
            });
        }

    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

function filterProducts(categoryName) {
    if (!categoryName) {
        renderProducts(allProducts);
        return;
    }
    const filtered = allProducts.filter(p => p.category === categoryName);
    renderProducts(filtered);
}

function renderProducts(products) {
    const prodContainer = document.getElementById('products-container');
    if (!prodContainer) return;
    
    prodContainer.innerHTML = '';
    
    if (products.length === 0) {
        prodContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.title}" style="max-width:100%; border-radius:8px;">
            <h3>${prod.title}</h3>
            <p>${prod.price}</p>
            ${prod.category ? `<small style="color: #666; display:block; margin-bottom:10px;">${prod.category}</small>` : ''}
            <a href="${prod.link}">View Details</a>
        `;
        prodContainer.appendChild(card);
    });
}

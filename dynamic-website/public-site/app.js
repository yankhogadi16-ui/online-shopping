document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
});

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
            data.categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'category-card';
                card.innerHTML = `<h3>${cat.name}</h3>`;
                catContainer.appendChild(card);
            });
        }

        // Products
        const prodContainer = document.getElementById('products-container');
        if (prodContainer && data.products) {
            prodContainer.innerHTML = '';
            data.products.forEach(prod => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${prod.image}" alt="${prod.title}">
                    <h3>${prod.title}</h3>
                    <p>${prod.price}</p>
                    <a href="${prod.link}">View Details</a>
                `;
                prodContainer.appendChild(card);
            });
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

    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

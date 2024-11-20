let preloadedData = [];
const batchSize = 15;  
let currentBatch = 0;

const preloadNextBatch = () => {
    const nextPage = Math.floor(currentBatch / batchSize) + 1;
    
    if (!preloadedData[nextPage]) {
        fetch(`http://localhost:3000/api/all-cms-items?page=${nextPage}`)
            .then(response => response.json())
            .then(data => {
                preloadedData[nextPage] = data.items;
            })
            .catch(error => console.error('Error preloading CMS items:', error));
    }
};

const batchRenderItems = (items) => {
    const container = document.querySelector('.sites-collections-list');
    const fragment = document.createDocumentFragment();

    const batch = items.slice(currentBatch, currentBatch + batchSize);

    batch.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('site-collection-item');
        itemElement.innerHTML = `<h3>${item.title}</h3><img src="${item.image}" alt="${item.title}">`;
        fragment.appendChild(itemElement);
    });

    window.requestAnimationFrame(() => {
        container.appendChild(fragment);
    });

    currentBatch += batchSize;

    if (currentBatch >= items.length) {
        document.querySelector('#load-more-button').style.display = 'none';
    }
};

const loadMoreItems = async () => {
    const page = Math.floor(currentBatch / batchSize) + 1;
    const items = await fetchCMSItems(page);
    batchRenderItems(items);
};

const fetchCMSItems = async (page) => {
    try {
        const response = await fetch(`http://localhost:3000/api/all-cms-items?page=${page}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching CMS items:', error);
        return [];
    }
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadMoreItems();
            preloadNextBatch();
        }
    });
}, { threshold: 0.8 });

observer.observe(document.querySelector('#load-more-button'));

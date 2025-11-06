document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript file loaded!');
    console.log('Window width:', window.innerWidth);

    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');

    // Search modal elements
    const searchTrigger = document.querySelector('.search-trigger');
    const searchBackdrop = document.getElementById('search-backdrop');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchEmpty = document.getElementById('search-empty');

    let searchData = [];
    let searchLoaded = false;
    let searchActive = false;
    let searchLoadPromise = null;

    function renderSearchResults(matches) {
        if (!searchResults) return;
        searchResults.innerHTML = '';
        if (!matches.length) {
            if (searchEmpty) {
                searchEmpty.textContent = 'No results found.';
                searchEmpty.style.display = 'block';
            }
            return;
        }
        if (searchEmpty) {
            searchEmpty.style.display = 'none';
        }
        matches.slice(0, 12).forEach(item => {
            const link = document.createElement('a');
            link.href = item.permalink;
            link.className = 'search-result';
            link.setAttribute('role', 'listitem');
            link.innerHTML = `
                <div class="search-result-meta">${item.section || ''}</div>
                <h3 class="search-result-title">${item.title}</h3>
                ${item.date ? `<div class="search-result-meta">${item.date}</div>` : ''}
                ${item.summary ? `<p class="search-result-summary">${item.summary}</p>` : ''}
            `;
            searchResults.appendChild(link);
        });
    }

    async function loadSearchIndex() {
        if (searchLoaded) return searchData;
        if (!searchLoadPromise) {
            if (searchEmpty) {
                searchEmpty.textContent = 'Loading…';
                searchEmpty.style.display = 'block';
            }
            searchLoadPromise = fetch('/index.json')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch search index');
                    return res.json();
                })
                .then(data => {
                    searchData = Array.isArray(data) ? data.map(entry => ({
                        title: entry.title || '',
                        summary: entry.summary || entry.content || '',
                        section: entry.section || '',
                        date: entry.date || '',
                        permalink: entry.permalink || '#'
                    })) : [];
                    searchLoaded = true;
                    if (searchEmpty) {
                        searchEmpty.textContent = 'Type to start searching.';
                    }
                    return searchData;
                })
                .catch(err => {
                    console.error('Search index load error:', err);
                    if (searchEmpty) {
                        searchEmpty.textContent = 'Unable to load search data.';
                    }
                    return [];
                });
        }
        return searchLoadPromise;
    }

    function openSearch() {
        if (!searchBackdrop || searchActive) return;
        searchBackdrop.hidden = false;
        requestAnimationFrame(() => {
            searchBackdrop.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
        searchActive = true;
        loadSearchIndex().then(() => {
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    function closeSearch() {
        if (!searchBackdrop || !searchActive) return;
        searchBackdrop.classList.remove('active');
        const finalizeClose = () => {
            searchBackdrop.hidden = true;
            document.body.style.overflow = '';
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchResults) {
                searchResults.innerHTML = '';
            }
            if (searchEmpty) {
                searchEmpty.textContent = 'Type to start searching.';
                searchEmpty.style.display = 'block';
            }
            searchActive = false;
            searchBackdrop.removeEventListener('transitionend', finalizeClose);
        };
        searchBackdrop.addEventListener('transitionend', finalizeClose, { once: true });
    }

    function handleSearchInput(event) {
        const query = event.target.value.trim().toLowerCase();
        if (!query) {
            if (searchResults) {
                searchResults.innerHTML = '';
            }
            if (searchEmpty) {
                searchEmpty.textContent = 'Type to start searching.';
                searchEmpty.style.display = 'block';
            }
            return;
        }
        if (!searchLoaded || !searchData.length) {
            return;
        }
        const matches = searchData.filter(item => {
            const haystack = `${item.title} ${item.summary}`.toLowerCase();
            return haystack.includes(query);
        });
        renderSearchResults(matches);
    }

    if (searchTrigger && searchBackdrop && searchClose) {
        searchTrigger.addEventListener('click', openSearch);
        searchTrigger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openSearch();
            }
        });
        searchClose.addEventListener('click', closeSearch);
        if (searchInput) {
            searchInput.addEventListener('input', handleSearchInput);
        }
        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', closeSearch);
        }
        if (searchModal) {
            searchModal.addEventListener('click', (event) => event.stopPropagation());
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSearch();
            }
        });
    }

    // Desktop: Only toggle dropdown for default-hidden items
    // Mobile: Toggle entire menu visibility
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('active');
            console.log('Menu toggled, active:', menu.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target)) {
                menu.classList.remove('active');
                console.log('Menu closed by outside click');
            }
        });
    } else {
        console.log('Menu toggle or menu not found!');
    }

    // Smooth scroll / redirect for NOW SHOWING link
    const nowShowingLink = document.querySelector('.menu a[data-target-id]');
    if (nowShowingLink) {
        nowShowingLink.addEventListener('click', function(event) {
            const targetId = this.dataset.targetId;
            const homeUrl = this.dataset.homeUrl || '/';
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                event.preventDefault();
                if (menu) {
                    menu.classList.remove('active');
                }
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const base = window.location.pathname + window.location.search;
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', `${base}#${targetId}`);
                } else {
                    window.location.hash = targetId;
                }
            } else {
                event.preventDefault();
                window.location.href = `${homeUrl}#${targetId}`;
            }
        });
    }
  
    // Mobile tap functionality for film cards
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.film').forEach(film => {
            film.addEventListener('click', function(e) {
                // Close all other active films
                document.querySelectorAll('.film.active').forEach(activeFilm => {
                    if (activeFilm !== this) {
                        activeFilm.classList.remove('active');
                    }
                });
        
                // Toggle current film
                this.classList.toggle('active');
                e.stopPropagation();
            });
        });
    
        // Close all films when tapping outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.film')) {
                document.querySelectorAll('.film.active').forEach(film => {
                    film.classList.remove('active');
                });
            }
        });
    }

    /* Order for mobile screens */
    function reorderSections() {
        console.log('reorderSections called, width:', window.innerWidth);
        
        if (window.innerWidth <= 768) {
            const container = document.querySelector('.page-content');
            const hero = document.querySelector('.hero');
            const recent = document.querySelector('.recently-added');
            const feature1 = document.querySelector('.feature-1');
            const trending = document.querySelector('.trending');
            const feature2 = document.querySelector('.feature-2');
            const staff = document.querySelector('.staff-picks');
            const space = document.querySelector('.space');
            const addHeight = document.querySelector('.add-height');

            console.log('Found elements:', {
                container: !!container,
                hero: !!hero,
                recent: !!recent,
                feature1: !!feature1,
                trending: !!trending,
                feature2: !!feature2,
                staff: !!staff,
                space: !!space,
                addHeight: !!addHeight
            });

            if (container && hero && recent && feature1 && trending && feature2 && staff) {
                console.log('Reordering sections...');
                const fragment = document.createDocumentFragment();
                [hero, recent, feature1, trending, feature2, staff]
                    .forEach(section => fragment.appendChild(section));
                [space, addHeight].forEach(section => {
                    if (section) {
                        fragment.appendChild(section);
                    }
                });
                container.appendChild(fragment);
                console.log('Reordering complete');
            } else {
                console.log('Some elements not found or container missing!');
            }
        }
    }

    // Run on load and resize
    reorderSections();
    window.addEventListener('resize', reorderSections);
});

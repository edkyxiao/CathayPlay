document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript file loaded!');
    console.log('Window width:', window.innerWidth);
    
    // Mobile menu toggle
    if (window.innerWidth <= 768) {
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.querySelector('.menu');
    
        menuToggle.addEventListener('click', function(e) {
            menu.classList.toggle('active');
            e.stopPropagation();
        });
    
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.menu')) {
                menu.classList.remove('active');
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
            const body = document.body;
            const hero = document.querySelector('.hero');
            const curators = document.querySelector('.curators-spotlight');
            const feature1 = document.querySelector('.feature-1');
            const trending = document.querySelector('.trending');
            const feature2 = document.querySelector('.feature-2');
            const suggested = document.querySelector('.suggested');
            const space = document.querySelector('.space');
            const addHeight = document.querySelector('.add-height');
            
            console.log('Found elements:', {
                hero: !!hero,
                curators: !!curators,
                feature1: !!feature1,
                trending: !!trending,
                feature2: !!feature2,
                suggested: !!suggested,
                space: !!space,
                addHeight: !!addHeight
            });
            
            if (hero && curators && feature1 && trending && feature2 && suggested) {
                console.log('Reordering sections...');
                // Reorder by appending in desired order
                body.appendChild(hero);
                body.appendChild(curators);
                body.appendChild(feature1);
                body.appendChild(trending);
                body.appendChild(feature2);
                body.appendChild(suggested);
                if (space) body.appendChild(space);
                if (addHeight) body.appendChild(addHeight);
                console.log('Reordering complete');
            } else {
                console.log('Some elements not found!');
            }
        }
    }

    // Run on load and resize
    reorderSections();
    window.addEventListener('resize', reorderSections);
});

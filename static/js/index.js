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
});

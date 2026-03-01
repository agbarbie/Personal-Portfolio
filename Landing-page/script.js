function toggleMenu() {
      document.getElementById('nav-menu')
        .classList.toggle('open');
    }

    document.querySelectorAll('.nav-menu a').forEach(a => {
      a.addEventListener('click', () => {
        document.getElementById('nav-menu')
          .classList.remove('open');
      });
    });
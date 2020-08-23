document.addEventListener('click', event => {
    let openImages = document.querySelectorAll('.open');

    for (let i = 0; i < openImages.length; i++) {
        if (openImages[i] === event.target) {
            continue;
        }
        openImages[i].classList.remove('open');
    }

    if (event.target.matches('img')) {
        event.target.classList.toggle('open');
    }
})
document.addEventListener('click', event => {
    let open = document.querySelector('.open');
    if (open) {
        open.classList.remove('open');
        return;
    }

    if (!event.target.matches('img')) {
        return;
    }

    let imgContainer = event.target.closest('.image-container');
    imgContainer.classList.add('open');
    // console.log(imgContainer);



})
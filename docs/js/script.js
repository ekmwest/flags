document.addEventListener('click', event => {
    if (!event.target.matches('.flag')) {
        return;
    }

    openModal(event.target);

    // let open = document.querySelector('.open');
    // if (open) {
    //     open.classList.remove('open');
    //     return;
    // }

    // if (!event.target.matches('.flag')) {
    //     return;
    // }

    // let imgContainer = event.target.closest('.flag-container');
    // imgContainer.classList.add('open');

});

document.addEventListener('click', event => {
    const modal = event.target.closest('.modal');

    if (!modal) {
        return;
    }

    closeModal();
});

function openModal(flagElement) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const img = document.createElement('img');
    img.onload = event => {
        setTimeout(() => modal.classList.add('open'), 1);
    }
    img.classList.add('flag-in-modal');
    img.src = flagElement.src;
    modal.appendChild(img);

    document.body.appendChild(modal);

    // setTimeout(closeModal, 3000);
}

function closeModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    document.body.removeChild(modal);
}
document.addEventListener('click', event => {
    if (!event.target.matches('.flag')) {
        return;
    }

    openModal(event.target);
});

document.addEventListener('click', event => {
    const modal = event.target.closest('.modal');

    if (!modal) {
        return;
    }

    closeModal();
});

document.addEventListener('keyup', event => {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    closeModal();
})

function openModal(flagElement) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const img = document.createElement('img');
    img.classList.add('flag-in-modal');
    modal.appendChild(img);

    var rect = flagElement.getBoundingClientRect();

    img.style.top = rect.top + 'px';
    img.style.left = rect.left + 'px';
    img.style.width = rect.width + 'px';
    img.style.height = rect.height + 'px';

    const viewportAspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
    const flagAspectRatio = rect.width / rect.height;

    img.onload = event => {
        setTimeout(() => {
            modal.classList.add('open');

            let zoom = 0.9;

            if (flagAspectRatio > viewportAspectRatio) {
                zoom = zoom * document.documentElement.clientWidth / rect.width;
            } else {
                zoom = zoom * document.documentElement.clientHeight / rect.height;
            }

            const zoomedWidth = zoom * rect.width;
            const zoomedHeight = zoom * rect.height;

            img.style.width = zoomedWidth + 'px';
            img.style.height = zoomedHeight + 'px';

            img.style.left = ((document.documentElement.clientWidth - zoomedWidth) / 2) + 'px';
            img.style.top = ((document.documentElement.clientHeight - zoomedHeight) / 2) + 'px';
        }, 10);
    }

    img.src = flagElement.src;

    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    document.body.removeChild(modal);
}

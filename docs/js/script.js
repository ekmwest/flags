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
    if (event.key !== 'Escape') {
        return;
    }

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

    const caption = document.createElement('p');
    caption.classList.add('modal-caption');
    caption.textContent = flagElement.getAttribute('alt');
    modal.appendChild(caption);

    var rect = flagElement.getBoundingClientRect();

    img.style.top = rect.top + 'px';
    img.style.left = rect.left + 'px';
    img.style.width = rect.width + 'px';
    img.style.height = rect.height + 'px';

    img.dataset.top = img.style.top;
    img.dataset.left = img.style.left;
    img.dataset.width = img.style.width;
    img.dataset.height = img.style.height;

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
                zoom = 0.9 * zoom; // extra space for caption
            }

            const zoomedWidth = zoom * rect.width;
            const zoomedHeight = zoom * rect.height;

            const zoomedLeft = ((document.documentElement.clientWidth - zoomedWidth) / 2);
            const zoomedTop = ((document.documentElement.clientHeight - zoomedHeight) / 2);

            img.style.width = zoomedWidth + 'px';
            img.style.height = zoomedHeight + 'px';

            img.style.left = zoomedLeft + 'px';
            img.style.top = zoomedTop + 'px';

            caption.style.top = (zoomedHeight + zoomedTop) + 'px';
            caption.style.left = zoomedLeft + 'px';
            caption.style.width = zoomedWidth + 'px';
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

    const img = modal.querySelector('.flag-in-modal');

    img.style.top = img.dataset.top;
    img.style.left = img.dataset.left;
    img.style.width = img.dataset.width;
    img.style.height = img.dataset.height;

    modal.classList.remove('open');

    setTimeout(() => document.body.removeChild(modal), 500);
}

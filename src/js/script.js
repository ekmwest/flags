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

    var rect = flagElement.getBoundingClientRect();

    const viewportAspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
    const flagAspectRatio = rect.width / rect.height;

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

    const scale = 1 / zoom;

    const translateX = (rect.width / 2 + rect.left - zoomedWidth / 2 - zoomedLeft);
    const translateY = (rect.height / 2 + rect.top - zoomedHeight / 2 - zoomedTop);

    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    img.dataset.transform = img.style.transform;

    const caption = document.createElement('p');
    caption.classList.add('modal-caption');
    caption.textContent = flagElement.getAttribute('alt');
    caption.style.top = (zoomedHeight + zoomedTop) + 'px';
    caption.style.left = zoomedLeft + 'px';
    caption.style.width = zoomedWidth + 'px';
    modal.appendChild(caption);

    img.onload = event => {
        setTimeout(() => {
            modal.classList.add('open');
            img.style.transform = "";
        }, 10);
    };

    img.src = flagElement.src;

    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    const img = modal.querySelector('.flag-in-modal');
    img.style.transform = img.dataset.transform;

    modal.classList.remove('open');

    setTimeout(() => document.body.removeChild(modal), 300);
}

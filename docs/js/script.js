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
    const documentElement_clientWidth = document.documentElement.clientWidth;
    const documentElement_clientHeight = document.documentElement.clientHeight;

    const rect = flagElement.getBoundingClientRect();

    const viewportAspectRatio = documentElement_clientWidth / documentElement_clientHeight;
    const flagAspectRatio = rect.width / rect.height;

    let zoom = 0.9;

    if (flagAspectRatio > viewportAspectRatio) {
        zoom = zoom * documentElement_clientWidth / rect.width;
    } else {
        zoom = zoom * documentElement_clientHeight / rect.height;
        zoom = 0.9 * zoom; // extra space for caption
    }

    const zoomedWidth = zoom * rect.width;
    const zoomedHeight = zoom * rect.height;

    const zoomedLeft = ((documentElement_clientWidth - zoomedWidth) / 2);
    const zoomedTop = ((documentElement_clientHeight - zoomedHeight) / 2);

    const translateX = (rect.width / 2 + rect.left - zoomedWidth / 2 - zoomedLeft);
    const translateY = (rect.height / 2 + rect.top - zoomedHeight / 2 - zoomedTop);

    const scale = 1 / zoom;

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const img = document.createElement('img');
    img.classList.add('flag-in-modal');
    modal.appendChild(img);

    img.style.width = zoomedWidth + 'px';
    img.style.height = zoomedHeight + 'px';

    img.style.left = zoomedLeft + 'px';
    img.style.top = zoomedTop + 'px';

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

    // disable scroll
    document.body.style.top = `-${window.pageYOffset}px`;
    document.body.style.position = 'fixed';

    document.body.appendChild(modal);
    img.src = flagElement.src;
}

function closeModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    // enable scroll
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    const img = modal.querySelector('.flag-in-modal');
    img.style.transform = img.dataset.transform;

    modal.classList.remove('open');

    setTimeout(() => document.body.removeChild(modal), 300);
}

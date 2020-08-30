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

    disableScroll();

    document.body.appendChild(modal);
    img.src = flagElement.src;
}

function closeModal() {
    const modal = document.querySelector('.modal');

    if (!modal) {
        return;
    }

    enableScroll();

    const img = modal.querySelector('.flag-in-modal');
    img.style.transform = img.dataset.transform;

    modal.classList.remove('open');

    setTimeout(() => document.body.removeChild(modal), 300);
}

function disableScroll() {

    // (1) Solution from benfrain.com
    const initialClientWidth = document.documentElement.clientWidth;
    document.body.classList.add('modal-open');
    document.body.style.paddingRight = (document.documentElement.clientWidth - initialClientWidth) + 'px';

    // (2) Solution from javascript info
    // const initialClientWidth = document.documentElement.clientWidth;
    // document.body.style.overflowY = 'hidden';
    // document.body.style.paddingRight = (document.documentElement.clientWidth - initialClientWidth) + 'px';

    // (3) Another solution
    // document.addEventListener('touchmove', preventDefault, { passive: false });
    // document.addEventListener('touchforcechange', preventDefault, { passive: false });
    // document.addEventListener('scroll', preventDefault, { passive: false });
}

function enableScroll() {

    // (1) Solution from benfrain.com
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';

    // (2) Solution from javascript info
    // document.body.style.overflowY = '';
    // document.body.style.paddingRight = '';

    // (3) Another solution
    // document.removeEventListener('touchmove', preventDefault, { passive: false });
    // document.removeEventListener('touchforcechange', preventDefault, { passive: false });
    // document.removeEventListener('scroll', preventDefault, { passive: false });
}

// function preventDefault(event) {
//     console.log('s');
//     event.preventDefault();
//     event.stopImmediatePropagation();
// }

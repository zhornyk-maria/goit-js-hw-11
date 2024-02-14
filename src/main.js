
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const API_KEY = '42335875-35ce8b2853e0e3d6760ada5fc';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;
const form = document.querySelector('.js-search-form');
const gallery = document.querySelector('.js-gallery');

let lightbox = new SimpleLightbox('.gallery a');

function showError(msg) {
    iziToast.show({
        message: msg,
        messageColor: '#fff',
        position: 'topRight',
        backgroundColor: '#ef4040',
        animateInside: false,
        color: '#fff'
    });

    gallery.innerHTML = '';
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const query = formData.get('search-input');

    if (!query) {
        showError("Sorry, there are no images matching your search query. Please try again!");
        return;
    }

    gallery.innerHTML = '<div class="loader"></div>';


    const url = `${BASE_URL}&q=${encodeURIComponent(query)}`;
    
    fetch(url).then(res => res.json()).then(data => {
        if (!data || data.hits.length === 0) {
            showError("Sorry, there are no images matching your search query. Please try again!");
            return;
        }
        const markup = data.hits.map(image => {
            return `<a href="${image.largeImageURL}">
                <img src="${image.webformatURL}">
                <div>
                    <span>likes<br>${image.likes}</span>
                    <span>views<br>${image.views}</span>
                    <span>comments<br>${image.comments}</span>
                    <span>downloads<br>${image.downloads}</span>
                </div>
            </a>`
        }).join('');
        gallery.innerHTML = markup;
        lightbox.refresh();
    }).catch((e) => {
        showError(e.message);
    })
})



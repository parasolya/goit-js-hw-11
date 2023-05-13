import './css/styles.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import createGalleryCards from './templates/photo-card.hbs';
import { UnsplashAPI } from './fetch';

const loadMoreBtnEl = document.querySelector('.load-more');
const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const searchBtnEl = document.querySelector('button[type="submit"]');

searchBtnEl.classList.add('search-btn');

const unsplashAPI = new UnsplashAPI();

const unsuccessfulSearch = () => {
  loadMoreBtnEl.classList.add('is-hidden');
  galleryListEl.innerHTML = '';
  Notiflix.Report.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const handleSearchPhotos = async event => {
  event.preventDefault();
  unsplashAPI.page = 1;
  const searchPhotos = event.target.elements['searchQuery'].value.trim();
  if (searchPhotos === '') {
    unsuccessfulSearch();
    return;
  }
  unsplashAPI.query = searchPhotos;
  try {
    galleryListEl.innerHTML = '';
    const { data } = await unsplashAPI.getPhotos();
    if (data.hits.length === 0) {
      unsuccessfulSearch();
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    data.hits.map(el =>
      galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(el))
    );    

    // 22
    const modalPopEl = document.querySelector('[data-modal]');
    const closeModalBtn = document.querySelector('[data-modal-close]');  
    

    function handleShowPop(event) {
      
      
      const popEl = document.querySelector('.photo-card');      
      const infoPopEl = document.querySelector('.pop-info');

      const popId = event.target.id;
      console.log(popId);
      console.log(data.hits);

      let objectId = {};
      data.hits.map(el => {
        
        if (el.id = popId) {
          objectId = el;
          return 
        }
      }         
      );
      console.log(objectId);

      toggleModal();
         
      infoPopEl.innerHTML = '';
      infoPopEl.insertAdjacentHTML(
        'beforeend',
        `<img class="photo" src="${objectId.webformatURL}" alt="${objectId.tags}" loading="lazy" />
         <p>${objectId.tags}</p>
        `
      );
    };
    galleryListEl.addEventListener('click', handleShowPop); //виклик модал
    closeModalBtn.addEventListener('click', closeModal);

    function toggleModal() {
      modalPopEl.classList.toggle('is-hidden');
    };
    function closeModal() {
      modalPopEl.classList.add('is-hidden');
    };
    // 22

    const numberOfPages = data.totalHits / unsplashAPI.per_page;
    console.log(unsplashAPI.page);
    console.log(numberOfPages);
    if (unsplashAPI.page >= numberOfPages) {
      return;
    }

    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};
const handleLoadMoreBtnClick = async () => {
  unsplashAPI.page += 1;
  console.log(unsplashAPI.page);

  try {
    const { data } = await unsplashAPI.getPhotos();
    data.hits.map(el =>
      galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(el))
    );

    const numberOfPages = data.totalHits / unsplashAPI.per_page;
    console.log(numberOfPages);
    if (unsplashAPI.page - 1 > numberOfPages) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      loadMoreBtnEl.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};
searchFormEl.addEventListener('submit', handleSearchPhotos);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

let gallery = new SimpleLightbox('.gallery a');



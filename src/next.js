import './css/styles.css';

import Notiflix from 'notiflix';
import createGalleryCards from './templates/photo-card.hbs';

// 22

import BookService from './book-service';
const bookTopAPI = new BookService();
// import { showError } from './notify.js'

// 22

const galleryListEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');

const handleSearchPhotos = () => {
  bookTopAPI
    .getTopBooks()
    .then(data => {
      data.map(el =>
        galleryListEl.insertAdjacentHTML(
          'beforeend',
          createGalleryCards(el.books[0])
        )
      );

      // 22
      
      const modalPopEl = document.querySelector('[data-modal]');
      const closeModalBtn = document.querySelector('[data-modal-close]');
      let localData = [];
      function handleShowPop(event) {
        const infoPopEl = document.querySelector('.pop-info');
        toggleModal();
        const popId = event.target.id;
        // console.log(popId);
        // console.log(event.target);
        const bookID = new BookService();
        //  const dataId = '';
        bookID
          .getBooksById(popId)
          .then(dataId => {
            dataId.add = "";
            console.log(dataId);
            infoPopEl.innerHTML = '';
            infoPopEl.insertAdjacentHTML(
              'beforeend',
              `<img class="photo" src="${dataId.book_image}" alt="${dataId.author}" loading="lazy" />
          <div class="pop_info">
           <p class="pop_name">${dataId.list_name}</p>
           <p class="pop_author">${dataId.author}</p>
           <p class="pop_description">${dataId.description}</p>                     
             <ul class="pop_shop list">               
             </ul>                
           </div>
          `
            );
            const popListEl = document.querySelector('.pop_shop');
            dataId.buy_links.map(el => {
              if (el.name === 'Amazon') {
                popListEl.insertAdjacentHTML(
                  'beforeend',
                  `<li>
                     <a
                       class="pop_shop__link link"
                       href="${el.url}"
                       target="_blank"
                       rel="noopener noreferrer"                       
                     ><img class="pop_shop__icon" src="${dataId.book_image}" alt="Amazon" width="40" height="40"/>                      
                     </a>
                   </li>            
                  `
                );
              }
              if (el.name === 'Apple Books') {
                popListEl.insertAdjacentHTML(
                  'beforeend',
                  `<li><a
                               class="pop_shop__link link"
                               href="${el.url}"
                               target="_blank"
                               rel="noopener noreferrer"
                               
                             ><img class="pop_shop__icon" src="${dataId.book_image}" alt="Apple Books" width="40" height="40"/>                      
                             </a>
                           </li>`
                );
              }
              if (el.name === 'Bookshop') {
                popListEl.insertAdjacentHTML(
                  'beforeend',
                  `<li><a              class="pop_shop__link link"
                                       href="${el.url}"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       
                                     ><img class="pop_shop__icon" src="${dataId.book_image}" alt="Bookshop" width="40" height="40"/>                     
                                     </a>
                                   </li>
                                 `
                );
              }
            });

            // Кнопка            
            const STORAGE_KEY = 'сhoice-book';
            const popBtn = document.querySelector('.pop__btn');
            popBtn.classList.remove('isAdded');

            const handleDoBtn = () => {    
              const popBook = dataId; 
              dataId.add = "isAdded";           
              // popBtn.classList.toggle('isAdded');
              // console.log(popBtn);
              if (dataId.add === "isAdded") {
                popBtn.innerHTML = 'remove from the shopping list'
              };
              if (!dataId.add === "isAdded") {
                popBtn.innerHTML = 'Add to shopping list'
              };

              if (!localData.includes(popBook) && dataId.add === "isAdded") {
                localData = JSON.parse(localStorage.getItem('STORAGE_KEY')) || [];
                localData.push(popBook);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
                console.log(popBook);
              console.log(localData);
                
              };

              if (!dataId.add === "isAdded") {
                localData = JSON.parse(localStorage.getItem('STORAGE_KEY')) || [];
                const index = localData.indexOf(popBook);
                   if (index !== -1) {
                     localData.splice(index, 1);
                   }              
                localStorage.setItem('STORAGE_KEY', JSON.stringify(localData));
                dataId.add === "";
                console.log(localData); 
                           
              }ж
              popBtn.removeEventListener('click', handleDoBtn);
              return;            
            };
            popBtn.addEventListener('click', handleDoBtn);
          })
          .catch(error => {
            console.log(error);
            Notiflix.Report.failure('Oops');
          });
      }
      galleryListEl.addEventListener('click', handleShowPop); //виклик модал
      closeModalBtn.addEventListener('click', closeModal);
      const handleUseKey = event => {
        if (event.key == 'Escape') {
          closeModal();
        }
      };
      document.addEventListener('keydown', handleUseKey);

      function toggleModal() {
        modalPopEl.classList.toggle('is-hidden');
      }
      function closeModal() {
        modalPopEl.classList.add('is-hidden');
      }

      // 22
    })
    .catch(error => {
      console.log(error);
      Notiflix.Report.failure('Oops');
    });
};

formEl.addEventListener('click', handleSearchPhotos);

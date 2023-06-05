import Notiflix from 'notiflix';

let queryToFetch = '';

//Параметри пошуку Pixabay API
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '37030220-55e5b35e4370d44ae057df5d9';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = true;

//Писання на елементи
const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const buttonEl = document.querySelector('.button-search');
const galleryEl = document.querySelector('.gallery');

formEl.addEventListener('submit', onSubmitForm);

//Функція, що відбувається при сабміті фотми (фетч + рендер галереї)
function onSubmitForm(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === queryToFetch) {
    return;
  }
  queryToFetch = query;
  galleryEl.innerHTML = '';
  fetchImages(query)
    .then(images => {
      //   console.log(images);
      if (!images.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderImages(images);
    })
    // .then(images => console.log(images))
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
  formEl.reset();
}

//Функція, що фетчить картинки
function fetchImages(query) {
  return fetch(
    `${BASE_URL}?key=${KEY}&q=${query}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

//Функція, що генерує розмітку галереї картинок
function renderImages(images) {
  //   console.log(images.hits);
  const markup = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

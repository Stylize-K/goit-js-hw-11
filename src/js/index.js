import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
let queryToFetch = '';
let pageToFetch = 1;

//Писання на елементи
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmitForm);
buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);

//Функція, що відбувається при сабміті фотми (фетч + рендер галереї)
function onSubmitForm(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === queryToFetch) {
    return;
  }
  queryToFetch = query;
  galleryEl.innerHTML = '';
  buttonLoadMore.classList.add('unvisible');
  getImages(queryToFetch, pageToFetch);
  formEl.reset();
}

//Функція, що рендерить наступну порцію картинок по кліку на кнопку "Load more"
function onBtnLoadMoreClick() {
  buttonLoadMore.classList.add('unvisible');
  pageToFetch += 1;
  getImages(queryToFetch, pageToFetch);
}

//Функція, що фетчить картинки
function fetchImages(queryToFetch, pageToFetch) {
  const searchParams = new URLSearchParams({
    key: '37030220-55e5b35e4370d44ae057df5d9',
    q: queryToFetch,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: pageToFetch,
  });
  return fetch(`${BASE_URL}?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

//Функція, що генерує розмітку галереї картинок
function renderImages(images) {
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
        return `<a class="photo-link" href="${largeImageURL}"><div class="photo-card">
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
</div></a>`;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

//Функція, що фетчить та рендерить порцію картинок
function getImages(query, pageToFetch) {
  fetchImages(query, pageToFetch)
    .then(images => {
      console.log(images);
      if (!images.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      renderImages(images);

      //Ініціалізація біблітеки SimpleLightbox на згенеровану розмітку
      const options = {
        captionsData: 'alt',
        captionDelay: 250,
      };
      const lightbox = new SimpleLightbox('.gallery a', options);

      if (pageToFetch === 1) {
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      }

      if (images.totalHits >= pageToFetch * 40) {
        buttonLoadMore.classList.remove('unvisible');
      }

      if (images.totalHits <= pageToFetch * 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results"
        );
      }
    })
    // .then(images => console.log(images))
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops! Something went wrong!');
    });
}

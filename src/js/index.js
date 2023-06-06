import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

let queryToFetch = '';
let pageToFetch = 1;

//Писання на елементи
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

//Створюємо слухачів подій на форму та кнопку
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
async function fetchImages(queryToFetch, pageToFetch) {
  try {
    const { data } = await axios({
      params: {
        key: '37030220-55e5b35e4370d44ae057df5d9',
        q: queryToFetch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: pageToFetch,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong!');
  }
}

//Функція, що генерує розмітку галереї картинок
function renderImages(data) {
  const markup = data.hits
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
async function getImages(query, pageToFetch) {
  const data = await fetchImages(query, pageToFetch);
  if (!data.hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  renderImages(data);

  //Ініціалізація біблітеки SimpleLightbox на згенеровану розмітку
  const options = {
    captionsData: 'alt',
    captionDelay: 250,
  };
  const lightbox = new SimpleLightbox('.gallery a', options);

  if (pageToFetch === 1) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  if (data.totalHits >= pageToFetch * 40) {
    buttonLoadMore.classList.remove('unvisible');
  }

  if (data.totalHits <= pageToFetch * 40) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results"
    );
  }
}

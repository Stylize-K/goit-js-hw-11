import { getImages } from './getImages';

let queryToFetch = '';
let pageToFetch;

//Писання на елементи
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

//Створюємо слухачів подій на форму та кнопку
formEl.addEventListener('submit', onSubmitForm);
buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);

//Функція-хендлер, що відбувається при сабміті фотми (фетч + рендер галереї)
function onSubmitForm(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value;
  if (!query.trim() || query === queryToFetch) {
    return;
  }
  queryToFetch = query;
  galleryEl.innerHTML = '';
  pageToFetch = 1;
  buttonLoadMore.classList.add('unvisible');
  getImages(queryToFetch, pageToFetch);
  formEl.reset();
}

//Функція-хендлер, що рендерить наступну порцію картинок по кліку на кнопку "Load more"
function onBtnLoadMoreClick() {
  buttonLoadMore.classList.add('unvisible');
  pageToFetch += 1;
  getImages(queryToFetch, pageToFetch);
}

export { galleryEl, buttonLoadMore };

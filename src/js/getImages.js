import Notiflix from 'notiflix';
import { fetchImages, pageLimit } from './fetchImages';
import { renderImages } from './renderImages';
import { buttonLoadMore, lightbox } from './index';

//Функція, що фетчить та рендерить порцію картинок
const getImages = async (query, pageToFetch) => {
  try {
    const data = await fetchImages(query, pageToFetch);
    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderImages(data);
    //Викликаємо метод refresh бібліотеки simplelightbox після оновлення DOM
    lightbox.refresh();

    if (pageToFetch === 1) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.totalHits >= pageToFetch * pageLimit) {
      buttonLoadMore.classList.remove('unvisible');
    }

    if (data.totalHits <= pageToFetch * pageLimit) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results"
      );
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong!');
  }
};

export { getImages };

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, pageLimit } from './fetchImages';
import { renderImages } from './renderImages';
import { buttonLoadMore } from './index';

//Функція, що фетчить та рендерить порцію картинок
const getImages = async (query, pageToFetch) => {
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

  if (data.totalHits >= pageToFetch * pageLimit) {
    buttonLoadMore.classList.remove('unvisible');
  }

  if (data.totalHits <= pageToFetch * pageLimit) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results"
    );
  }
};

export { getImages };

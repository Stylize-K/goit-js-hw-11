import axios from 'axios';
import Notiflix from 'notiflix';

//Унікальний ключ доступу до API Pixabay
const KEY = '37030220-55e5b35e4370d44ae057df5d9';

//Ліміт отриманих об'ектів на сторінці
const pageLimit = 40;

axios.defaults.baseURL = 'https://pixabay.com/api/';

//Функція, що фетчить картинки
const fetchImages = async (queryToFetch, pageToFetch) => {
  const { data } = await axios({
    params: {
      key: KEY,
      q: queryToFetch,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: pageLimit,
      page: pageToFetch,
    },
  });
  return data;
};

export { fetchImages, pageLimit };

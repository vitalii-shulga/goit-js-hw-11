const BASE_URL = 'https://pixabay.com/api/'
const KEY = '24543353-3824dfbf23e7b5ead533e5f72'

export function fetchImages(query, page, perPage) {
  return fetch(
    `${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  )
    .then(response => response.json())
    .catch(error => console.log(error))
}

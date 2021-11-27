import './css/styles.css'
import { fetchImages } from './js/fetch-images'
import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'
import Notiflix from 'notiflix'

const searchForm = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')

searchForm.addEventListener('submit', onSearchForm)
loadMoreBtn.addEventListener('click', onLoadMoreBtn)

let query = ''
let page = 1
const perPage = 40

function onSearchForm(e) {
  e.preventDefault()
  page = 1
  query = e.currentTarget.searchQuery.value.trim()

  if (query === '') {
    alertNoEmptySearch()
    return
  }

  fetchImages(query, page, perPage)
    .then(data => {
      gallery.innerHTML = ''

      if (data.totalHits === 0) {
        loadMoreBtn.classList.add('is-hidden')
        alertNoImageMatching()
      } else {
        renderImageCard(data)

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden')
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
      }
    })
    .catch(error => console.log(error))
}

function onLoadMoreBtn() {
  page += 1

  fetchImages(query, page, perPage)
    .then(data => {
      const totalPages = Math.ceil(data.totalHits / perPage)
      renderImageCard(data)

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden')
        alertEndOfSearch()
      }
    })
    .catch(error => console.log(error))
}

function renderImageCard(data) {
  const markup = data.hits
    .map(
      ({ id, webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `
        <a class="gallery__link" href="${webformatURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${largeImageURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `,
    )
    .join('')
  gallery.insertAdjacentHTML('beforeend', markup)
  addSimpleLightbox()
}

function addSimpleLightbox() {
  new SimpleLightbox('.gallery a').refresh()
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.')
}

function alertNoImageMatching() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}

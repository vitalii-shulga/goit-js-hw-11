import './css/styles.css'
import { fetchImages } from './js/fetch-images'
import { renderGallery } from './js/render-gallery'
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
    .then(({ data }) => {
      gallery.innerHTML = ''
      window.scrollTo({ top: 0 })

      if (data.totalHits === 0) {
        loadMoreBtn.classList.add('is-hidden')
        alertNoImageMatching()
      } else {
        renderGallery(data.hits)

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
    .then(({ data }) => {
      const totalPages = Math.ceil(data.totalHits / perPage)
      renderGallery(data.hits)

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden')
        alertEndOfSearch()
      }
    })
    .catch(error => console.log(error))
}

function alertNoEmptySearch() {
  Notiflix.Notify.warning('The search string cannot be empty. Please specify your search query.')
}

function alertNoImageMatching() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}

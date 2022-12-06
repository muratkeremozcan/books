import {zipWith} from 'ramda'

const videos = [
  {
    id: 70111470,
    title: 'Die Hard',
    boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 4.0,
  },
  {
    id: 654356453,
    title: 'Bad Boys',
    boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 5.0,
  },
  {
    id: 65432445,
    title: 'The Chamber',
    boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 4.0,
  },
  {
    id: 675465,
    title: 'Fracture',
    boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: 5.0,
  },
]

// Exercise 21: Combine videos and bookmarks by index using zip

// the combined function will be the same length as the shortest input array
// try toggling some of the objects in the bookmarks array
const bookmarks = [
  {id: 470, time: 23432},
  {id: 453, time: 234324},
  {id: 445, time: 987834},
  // {id: 446, time: 987834},
]
// the combiner function will be called with the values from the two arrays
const f = (x, y) => [x, y]
zipWith(f, [1, 2, 3], ['a', 'b', 'c']) //?

const combiner = (video, bookmark) => ({
  videoId: video.id,
  bookmarkId: bookmark.id,
})
zipWith(combiner, videos, bookmarks) //?

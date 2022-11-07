import {prop, chain, pipe, compose, pluck} from 'ramda'

// Exercise 9: Flatten the movieLists array into an array of video ids

const movieLists = [
  {
    name: 'New Releases',
    videos: [
      {
        id: 70111470,
        title: 'Die Hard',
        boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 654356453,
        title: 'Bad Boys',
        boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
  {
    name: 'Dramas',
    videos: [
      {
        id: 65432445,
        title: 'The Chamber',
        boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
        uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
]

movieLists.flatMap(movieList => movieList.videos.map(video => video.id)) //?
movieLists.flatMap(({videos}) => videos.map(video => video.id)) //?
// rewrite in Ramda using chain (flatMap)
chain(({videos}) => videos.map(video => video.id))(movieLists) //?
chain(({videos}) => videos.map(prop('id')))(movieLists) //?
// rewrite in ramda using compose pipe
compose(chain(pluck('id')), pluck('videos'))(movieLists) //?
pipe(pluck('videos'), chain(pluck('id')))(movieLists) //?

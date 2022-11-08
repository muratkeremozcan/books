import {
  prop,
  tap,
  where,
  equals,
  filter,
  propEq,
  reduce,
  map,
  chain,
  pipe,
} from 'ramda'

const movieLists = [
  {
    name: 'Instant Queue',
    videos: [
      {
        id: 70111470,
        title: 'Die Hard',
        boxarts: [
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard150.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/DieHard200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 654356453,
        title: 'Bad Boys',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg',
          },
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
  {
    name: 'New Releases',
    videos: [
      {
        id: 65432445,
        title: 'The Chamber',
        boxarts: [
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg',
          },
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 4.0,
        bookmark: [],
      },
      {
        id: 675465,
        title: 'Fracture',
        boxarts: [
          {
            width: 200,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
          },
          {
            width: 150,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
          },
          {
            width: 300,
            height: 200,
            url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
          },
        ],
        url: 'http://api.netflix.com/catalog/titles/movies/70111470',
        rating: 5.0,
        bookmark: [{id: 432534, time: 65876586}],
      },
    ],
  },
]
// Exercise 12: Retrieve id, title, and a 150x200 box art url for every video

movieLists.map(movieList => {
  return movieList.videos.map(video => {
    return video.boxarts
      .filter(boxart => {
        return boxart.width === 150 && boxart.height === 200
      })
      .map(boxart => {
        return {id: video.id, title: video.title, url: boxart.url}
      })
  })
}) //?

// rewrite the above in ramda: this gets close but video. references are difficult
// const getBoxart = pipe(
//   chain(prop('videos')),
//   chain(prop('boxarts')),
//   filter(where({width: equals(150), height: equals(200)})),
// )(movieLists) //?

// this is similar enough
pipe(
  chain(prop('videos')),
  map(video =>
    video.boxarts
      .filter(boxart => boxart.width === 150 && boxart.height === 200)
      .map(boxart => ({id: video.id, title: video.title, url: boxart.url})),
  ),
)(movieLists) //?

pipe(
  chain(prop('videos')),
  map(video => {
    return video.boxarts
      .filter(boxart => {
        return boxart.width === 150 && boxart.height === 200
      })
      .map(boxart => {
        // boxart //?
        return {id: video.id, title: video.title, url: boxart.url}
      })
  }),
)(movieLists) //?

// Exercise 20: Retrieve the id, title, and smallest box art url for every video
{
  const smallestBoxArt = boxarts =>
    boxarts.reduce(
      (smallest, current) =>
        current.width * current.height < smallest.width * smallest.height
          ? current
          : smallest,
      {width: Infinity, height: Infinity},
    )
  // ramda version
  const smallestBoxArtR = reduce(
    (smallest, current) =>
      current.width * current.height < smallest.width * smallest.height
        ? current
        : smallest,
    {width: Infinity, height: Infinity}, // we need a comparator object for ramda reduce
  )

  const boxarts = [
    {
      width: 200,
      height: 200,
      url: 'http://cdn-0.nflximg.com/images/2891/Fracture200.jpg',
    },
    {
      width: 150,
      height: 200,
      url: 'http://cdn-0.nflximg.com/images/2891/Fracture150.jpg',
    },
    {
      width: 300,
      height: 200,
      url: 'http://cdn-0.nflximg.com/images/2891/Fracture300.jpg',
    },
    {
      width: 425,
      height: 150,
      url: 'http://cdn-0.nflximg.com/images/2891/Fracture425.jpg',
    },
  ]
  smallestBoxArt(boxarts) //?
  smallestBoxArtR(boxarts) //?

  const getVideos = chain(prop('videos'))
  const getUrl = prop('url')
  const smallestBoxArtUrl = pipe(smallestBoxArtR, getUrl)

  const idTitleSmallestBoxart = pipe(
    getVideos,
    map(video => ({
      id: video.id,
      title: video.title,
      url: smallestBoxArtUrl(video.boxarts),
    })),
  )

  idTitleSmallestBoxart(movieLists) //?
}

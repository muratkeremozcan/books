import {map, identity, filter, pipe} from 'ramda'

// http://reactivex.io/learnrx/

// Traversing an Array
// Exercise 1: Print all the names in an array

const names = ['Ben', 'Jafar', 'Matt', 'Priya', 'Brian']

// lame version
// for (let counter = 0; counter < names.length; counter++) {
//   console.log(names[counter])
// }

// better version
names.map(name => name) //?
map(identity)(names) //?

//////
// Exercise 2: Use forEach to print all the names in an array (bleh forEach)
names.forEach(name => name) //?

//////
//Exercise 3: Project an array of videos into an array of {id,title} pairs using forEach()
const newReleases = [
  {
    id: 70111470,
    title: 'Die Hard',
    boxart: 'http://cdn-0.nflximg.com/images/2891/DieHard.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: [4.0],
    bookmark: [],
  },
  {
    id: 654356453,
    title: 'Bad Boys',
    boxart: 'http://cdn-0.nflximg.com/images/2891/BadBoys.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: [5.0],
    bookmark: [{id: 432534, time: 65876586}],
  },
  {
    id: 65432445,
    title: 'The Chamber',
    boxart: 'http://cdn-0.nflximg.com/images/2891/TheChamber.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: [4.0],
    bookmark: [],
  },
  {
    id: 675465,
    title: 'Fracture',
    boxart: 'http://cdn-0.nflximg.com/images/2891/Fracture.jpg',
    uri: 'http://api.netflix.com/catalog/titles/movies/70111470',
    rating: [5.0],
    bookmark: [{id: 432534, time: 65876586}],
  },
]

newReleases.map(newRelease => ({id: newRelease.id, title: newRelease.title})) //?
// rewrite in Ramda
map(newRelease => ({id: newRelease.id, title: newRelease.title}))(newReleases) //?
map(({id, title}) => ({id, title}))(newReleases) //?

/////
// Exercise 6 collect only those videos with a rating of 5.0

newReleases.filter(newRelease => newRelease.rating[0] === 5.0) //?
// rewrite in Ramda
filter(newRelease => newRelease.rating[0] === 5.0)(newReleases) //?
filter(({rating}) => rating[0] === 5.0)(newReleases) //?

/////
// Exercise 8: Chain filter and map to collect the ids of videos that have a rating of 5.0
newReleases.filter(newRelease => newRelease.rating[0] === 5.0).map(n => n.id) //?
// in Ramda
const get5star = filter(({rating}) => rating[0] === 5.0)
const getIds = map(({id}) => id)
pipe(get5star, getIds)(newReleases) //?

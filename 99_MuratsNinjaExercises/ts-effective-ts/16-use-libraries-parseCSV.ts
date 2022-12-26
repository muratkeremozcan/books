import _ from 'lodash'
import R from 'ramda'

// Use built-in functional constructs and those in utility libraries like Lodash
// instead of hand-rolled constructs to improve type flow, increase legibility, and reduce the need for explicit type annotations.

// parsing a csv file

interface BasketballPlayer {
  name: string
  team: string
  salary: number
}
declare const rosters: {[team: string]: BasketballPlayer[]}

// hand-rolled solution
{
  const allPlayers = Object.values(rosters).flat()
  // OK, type is BasketballPlayer[]
  const teamToPlayers: {[team: string]: BasketballPlayer[]} = {}
  for (const player of allPlayers) {
    const {team} = player
    teamToPlayers[team] = teamToPlayers[team] || []
    teamToPlayers[team].push(player)
  }

  for (const players of Object.values(teamToPlayers)) {
    players.sort((a, b) => b.salary - a.salary)
  }

  const bestPaid = Object.values(teamToPlayers).map(players => players[0])
  bestPaid.sort((playerA, playerB) => playerB.salary - playerA.salary)
  console.log(bestPaid)
}

// lodash solution
{
  const allPlayers = Object.values(rosters).flat()
  const bestPaid = _(allPlayers)
    .groupBy(player => player.team)
    .mapValues(players => _.maxBy(players, p => p.salary)!)
    .values()
    .sortBy(p => -p.salary)
    .value()
}

// ramda solution
{
  const allPlayers = R.flatten(R.values(rosters))
  const bestPaid = R.pipe(
    R.groupBy(R.prop('team')),
    R.values,
    R.map(R.sortBy(R.prop('salary'))),
    R.map(R.last),
    R.sortBy(R.prop('salary')),
  )(allPlayers)
}

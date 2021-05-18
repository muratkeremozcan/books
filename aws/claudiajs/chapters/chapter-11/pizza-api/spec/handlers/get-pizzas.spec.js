'use strict'

const underTest = require('../../handlers/get-pizzas') // <1>
const pizzas = [ // <2>
  {
    id: 1,
    name: 'Capricciosa'
  },
  {
    id: 2,
    name: 'Napoletana'
  }
]

describe('Get pizzas handler', () => { // <3>
  it('should return a list of all pizzas if called without pizza ID', () => { // <4>
    expect(underTest(undefined, pizzas)).toEqual(pizzas) // <5>
  })

  it('should return a single pizza if the existing ID is passed as a first parameter', () => { // <6>
    expect(underTest(1, pizzas)).toEqual(pizzas[0])
    expect(underTest(2, pizzas)).toEqual(pizzas[1])
  })

  it('should throw an error if non-existing ID is passed', () => { // <7>
    expect(() => underTest(0, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => underTest(3, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => underTest(1.5, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => underTest(42, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => underTest('A', pizzas)).toThrow('The pizza you requested was not found')
    expect(() => underTest([], pizzas)).toThrow('The pizza you requested was not found')
  })
})

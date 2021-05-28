'use strict'

const getPizzas = require('../../handlers/get-pizzas');

const pizzas = [
  {
    id: 1,
    name: 'Capricciosa'
  },
  {
    id: 2,
    name: 'Napoletana'
  }
];

describe('Get pizzas handler', () => {
  it('should return a list of all pizzas if called without pizza ID', () => {
    expect(getPizzas(undefined, pizzas)).toEqual(pizzas)
  });

  it('should return a single pizza if the existing ID is passed as a first parameter', () => {
    expect(getPizzas(1, pizzas)).toEqual(pizzas[0]);
    expect(getPizzas(2, pizzas)).toEqual(pizzas[1]);
  });

  it('should throw an error if non-existing ID is passed', () => {
    expect(() => getPizzas(0, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => getPizzas(3, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => getPizzas(1.5, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => getPizzas(42, pizzas)).toThrow('The pizza you requested was not found')
    expect(() => getPizzas('A', pizzas)).toThrow('The pizza you requested was not found')
    expect(() => getPizzas([], pizzas)).toThrow('The pizza you requested was not found')
  })
});

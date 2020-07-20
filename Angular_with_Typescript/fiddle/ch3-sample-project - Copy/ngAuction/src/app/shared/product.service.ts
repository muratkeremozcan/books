import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// new in Ch3


export class Product {
  // the Product instances will be returned by the methods of ProductService
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public description: string,
    public categories: string[]
  ) {}
}

// the class ProductService offers an API to get products
export class ProductService {

  /** returns all hardcoded products */
  getProducts(): Product[] {
    return products.map(p => new Product(p.id, p.title, p.price, p.rating, p.description, p.categories));
  }

  /** returns one product based on productId */
  getProductById(productId: number): Product {
    return products.find(p => p.id === productId);
  }
}

// hardcoded products
const products = [
  {
    id: 1,
    title: 'First Product',
    price: 24.99,
    rating: 4.3,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['electronics', 'hardware']
  },
  {
    id: 2,
    title: 'Second Product',
    price: 64.99,
    rating: 3.5,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['books']
  },
  {
    id: 3,
    title: 'Third Product',
    price: 74.99,
    rating: 4.2,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['electronics']
  },
  {
    id: 4,
    title: 'Fourth Product',
    price: 84.99,
    rating: 3.9,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['hardware']
  },
  {
    id: 5,
    title: 'Fifth Product',
    price: 94.99,
    rating: 5,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['electronics', 'hardware']
  },
  {
    id: 6,
    title: 'Sixth Product',
    price: 54.99,
    rating: 4.6,
    description: 'This is a short description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    categories: ['books']
  }
];
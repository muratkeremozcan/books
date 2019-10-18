function UIcomponent(html: string) {
    console.log(`The decorator received ${html} \n`);

    return function (target) { // the target here is the decorator function's target, which is the class that comes right after it
        console.log(`Creating a UI component from \n ${target} `);
    };
}

@UIcomponent("<h1>Hello Shopper!</h1>")
class Shopper {

    constructor(private name: string) { }
}


// To turn a TypeScript class into an Angular component, you need to decorate it with the @Component() decorator. 
// Angular will internally parse your annotations and generate code that adds the requested behavior to the TypeScript class. 
// To turn a class variable into a component property that can receive values, you use the @Input() decorator:

// @Component({
//     selector: 'order-processor',
//     template: `
//         Buying {{quantity}} shares}
//     `
// })
// export class OrderComponent {

//     @Input() quantity: number; // the @Input() decorator enables quantity property to receive values from the parent component via binding

// }
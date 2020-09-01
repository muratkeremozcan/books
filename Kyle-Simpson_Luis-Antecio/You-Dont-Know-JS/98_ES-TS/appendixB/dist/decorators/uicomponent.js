var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function UIcomponent(html) {
    console.log(`The decorator received ${html} \n`);
    return function (target) {
        console.log(`Creating a UI component from \n ${target} `);
    };
}
let Shopper = class Shopper {
    constructor(name) {
        this.name = name;
    }
};
Shopper = __decorate([
    UIcomponent("<h1>Hello Shopper!</h1>")
], Shopper);

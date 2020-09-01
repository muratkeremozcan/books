var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getCustomers() {
    return __awaiter(this, void 0, void 0, function* () {
        let promise = new Promise(function (resolve, reject) {
            console.log("Getting customers");
            // Emulate an async server call here
            setTimeout(function () {
                let success = true;
                if (success) {
                    resolve("John Smith"); // got the customer
                }
                else {
                    reject("Can't get customers");
                }
            }, 1000);
        });
        return promise;
    });
}
function getOrders(customer) {
    return __awaiter(this, void 0, void 0, function* () {
        let promise = new Promise(function (resolve, reject) {
            // Emulate an async server call here
            setTimeout(function () {
                let success = true; // change it to false
                if (success) {
                    resolve(`Found the order 123 for ${customer}`); // got the order
                }
                else {
                    reject(`getOrders() has thrown an error for ${customer}`);
                }
            }, 1000);
        });
        return promise;
    });
}
(function getCustomersOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield getCustomers(); // no callbacks
            console.log(`Got customer ${customer}`);
            const orders = yield getOrders(customer);
            console.log(orders);
        }
        catch (err) {
            console.log(err);
        }
    });
})();
console.log("This is the last line in the code. Chained getCustomers() and getOrders().");

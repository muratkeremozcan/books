class Employee {
    increasePay(percent) {
        console.log(`Increasing employee salary by ${percent}`);
    }
}
class Contractor {
    increasePay(percent) {
        console.log(`Increasing contractor's rate by ${percent}`);
    }
}
let workers = [];
workers[0] = new Employee();
workers[1] = new Contractor();
workers.forEach((worker) => worker.increasePay(20));

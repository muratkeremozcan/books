// Interface use 2:
// Declare an interface that includes abstract (non-implemented) methods.
// Have different classes do unique implementations of the method


// The implements keyword can be used with a class declaration to announce that the class will implement a particular interface
interface IPayable {
    increasePay(percent: number): void; // the interface only includes the signature of the method
}

// Now the Employee class can declare that it implements IPayable
class Employee implements IPayable {
    // the implements part is optional: compiler still sees that the class implements the method properly
    // but if you remove implements and change the signature, the compiler will complain
    increasePay(percent: number) {
        console.log(`Increasing employee salary by ${percent}`);
    }
}

// increasePay is different for contractors because their pay is hourly
class Contractor implements IPayable { 
    increaseCap: number = 20;

    increasePay(percent: number): boolean {
        if (percent <= this.increaseCap) {
            console.log(`Increasing hourly rate by ${percent}`);
            // return true;
        } else {
            console.log(`Sorry, the increase cap for contractors is ${this.increaseCap}`);
            // return false;
        }
    }
}

// declaring an array of type IPayable lets you place any objects that implement the IPayable type into the array
const workers: IPayable[] = [];

workers[0] = new Employee();
workers[1] = new Contractor();


workers.forEach(worker => worker.increasePay(30));

// workers.forEach(worker => worker.increasePay(20));
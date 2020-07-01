export type ValidStyleName = 'border-color' | 'background-color';

function Component(options: { id: string }) { // this decorator factory function targets the class, makes it into a component
  return (target) => {
    target.elId = options.id;
  };
}
function enumerable(isEnumerable: boolean) { // this decorator factory function targets the method
  return (target, propertyKey, propertyDescriptor: PropertyDescriptor) => {
    propertyDescriptor.enumerable = false;
  }
}
function prop(parameter, nameOfProperty) { // this decorator factory function targets the property
  console.log(parameter, nameOfProperty);
}
function param(parameter, name, index) { // this decorator factory function targets the parameter
  console.log(parameter, name, index);
}
@Component({ id: 'rainbow' }) // decorator factory : used to add more information & configure the class further
class App { // decorator function is targeting this class, turning it into a COMPONENT
  @prop // property decorator
  version: string;
  private static readonly elId: string = 'rainbow'; // declared at decorator
  private style: ValidStyleName;
  private int: number;
  constructor() {
    this.style = 'border-color';
    this.int = 1500;
  }

  @enumerable(false) // method decorator
  public startOnInit(@param version: string): void {  // parameter decorator
    var appComponent = document.getElementById(App.elId); // instead of the instance, using STATIC we can call the class itself
    setInterval(() => {
      if (appComponent) {
        appComponent.style[this.style] = generateColor();
      }
    }, this.int);
  }
}
export function generateColor(): string {
  return '#' + (((1 << 24) * Math.random()) | 0).toString(16);
}


const newApp = new App();

newApp; //?
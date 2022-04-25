import logMessage from "./logger";

// (2) refactor; now the class is responsible for 1 thing, therefore has 1 reason to change
class CalorieTracker {
  constructor(
    public maxCalories: number,
    private currentCalories: number = 0
  ) {}

  trackCalories(calorieCount: number) {
    this.currentCalories += calorieCount;
    if (this.currentCalories > this.maxCalories) {
      logMessage("Max calories exceeded!");
    }
    return null;
  }
}

const calorieTracker = new CalorieTracker(2000);

calorieTracker.trackCalories(2000);
calorieTracker.trackCalories(1);

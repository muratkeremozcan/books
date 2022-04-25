// Problem: the class is responsible for 2 things, therefore has 2 reasons to change
// tracking calories & logging

class CalorieTracker {
  constructor(
    public maxCalories: number,
    private currentCalories: number = 0
  ) {}

  trackCalories(calorieCount: number) {
    this.currentCalories += calorieCount;
    if (this.currentCalories > this.maxCalories) {
      this.logCalorieSurplus();
    }
    return null;
  }

  logCalorieSurplus() {
    console.log("Max calories exceeded!");
  }
}

const calorieTracker = new CalorieTracker(2000);

calorieTracker.trackCalories(2000);
calorieTracker.trackCalories(1);

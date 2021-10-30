import React, { lazy, Suspense, useState } from "react";
import "./styles.css";

const module = {
  default: () => <div>Big Calendar</div>
};

function getPromise() {
  return new Promise((resolve) => setTimeout(() => resolve(module), 3000));
}

const LazyCalendar = lazy(getPromise);

function CalendarWrapper() {
  const [isOn, setIsOn] = useState(false);
  return isOn ? (
    <LazyCalendar />
  ) : (
    <div>
      <button onClick={() => setIsOn(true)}>Show Calendar</button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <main>Main App</main>
      <aside>
        <Suspense fallback={<div>Loading...</div>}>
          <CalendarWrapper />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <CalendarWrapper />
        </Suspense>
      </aside>
    </div>
  );
}

import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchMessage, fetchNextMessage } from "./api";
import { makeThrower } from "./utils";
import "./styles.css";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <>
      <p className="error">{error}</p>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </>
  );
}

const getFirstMessage = makeThrower(fetchMessage());

function Message({ getMessage, next }) {
  const data = getMessage();
  return (
    <>
      <p className="message">{data.message}</p>
      <button onClick={next}>Next</button>
    </>
  );
}

export default function App() {
  const [getMessage, setGetMessage] = useState(() => getFirstMessage);

  function next() {
    const nextPromise = fetchNextMessage(2000, true);
    const getNextMessage = makeThrower(nextPromise);
    setGetMessage(() => getNextMessage);
  }

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={next}>
        <Suspense fallback={<p className="loading">Loading message...</p>}>
          <Message getMessage={getMessage} next={next} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const App1 = React.lazy(() => import('app1/App'));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const App2 = React.lazy(() => import('app2/App'));

function App() {
  return (
    <div>
      <h1>Hello Kamaal</h1>
      <App1 />
      <App2 />
    </div>
  );
}

export default App;

import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch } from 'react-redux';
import { usePageVisibility } from './hooks/usePageVisibility';

function App() {
  const dispatch = useDispatch();
  const isPageVisible = usePageVisibility();

  useEffect(() => {
    if (!isPageVisible) {
      dispatch({ type: 'CloseStream' });
    }
  }, [dispatch, isPageVisible]);

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={() => dispatch({ type: 'OpenStream' })}>open</button>
        <button onClick={() => dispatch({ type: 'CloseStream' })}>close</button>
      </header>
    </div>
  );
}

export default App;

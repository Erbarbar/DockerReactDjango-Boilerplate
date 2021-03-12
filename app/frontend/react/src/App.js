import React from 'react';
import Routes from './routes/Routes';
import { DjangoContextProvider } from './api/context/DjangoContext';

export default function App() {
  return (
    <DjangoContextProvider>
      <Routes />
    </DjangoContextProvider>
  );
}

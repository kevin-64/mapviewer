import React from 'react'
import { fromLonLat } from 'ol/proj';
import MapProvider from './contexts/MapProvider';
import TileLayer from './components/TileLayer';

interface AppProps {
}

const App = () => {

  return (
    <>
    <MapProvider center={fromLonLat([-118.2362, 33.9616])} zoom={11}>
        <TileLayer
          zIndex={0}
        />
    </MapProvider>      
    </>
  )
}

export default App;
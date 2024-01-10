import React from 'react'
import { fromLonLat } from 'ol/proj';
import MapProvider from './contexts/map/MapProvider';
import TileLayer from './components/TileLayer';
import FeatureLayer from './components/FeatureLayer';
import LineEditor from './components/LineEditor/LineEditor';

import './App.css';
import NewLineForm from './components/NewLineForm/NewLineForm';
import LineProvider from './contexts/line/LineProvider';
import ViewProvider from './contexts/view/ViewProvider';

interface AppProps {
}

const App = () => {
  return (
    <ViewProvider>
      <LineProvider>
        {/* <Blur> */}
          <div className="kts-app-container">
            <LineEditor></LineEditor>
            <NewLineForm></NewLineForm>
            <MapProvider center={fromLonLat([-118.2362, 33.9616])} zoom={11}>
                <TileLayer
                  zIndex={0}
                />
                <FeatureLayer />
            </MapProvider>      
          </div>
        {/* </Blur> */}
      </LineProvider>
    </ViewProvider>
  )
}

export default App;
import React from 'react'
import { fromLonLat } from 'ol/proj';
import { MapProvider } from 'ktsuilib';
import TileLayer from './components/TileLayer';
import FeatureLayer from './components/FeatureLayer';
import LineEditor from './components/LineEditor/LineEditor';

import './App.css';
import NewLineForm from './components/NewLineForm/NewLineForm';
import LineProvider from './contexts/line/LineProvider';
import ViewProvider from './contexts/view/ViewProvider';
import { MapStateProvider } from 'ktsuilib';
import EditPointForm from './components/EditPointForm/EditPointForm';

interface AppProps {
}

const App = () => {
  return (
    <ViewProvider>
      <LineProvider>
        {/* <Blur> */}
        <MapStateProvider startCenter={fromLonLat([-118.2362, 33.9616])} startZoom={13}>
          <div className="kts-app-container">
            <LineEditor></LineEditor>
            <NewLineForm></NewLineForm>
            <EditPointForm></EditPointForm>
            <MapProvider>
                <TileLayer
                  zIndex={0}
                />
                <FeatureLayer />
            </MapProvider>      
          </div>
        </MapStateProvider>
        {/* </Blur> */}
      </LineProvider>
    </ViewProvider>
  )
}

export default App;
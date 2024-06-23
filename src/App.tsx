import React from 'react'
import { fromLonLat } from 'ol/proj';
import { MapProvider, MapStateProvider, StandardTheme, TileLayer } from 'ktsuilib';
import LineEditor from './components/LineEditor/LineEditor';

import './App.css';
import NewLineForm from './components/NewLineForm/NewLineForm';
import LineProvider from './contexts/line/LineProvider';
import ViewProvider from './contexts/view/ViewProvider';
import EditPointForm from './components/EditPointForm/EditPointForm';
import { TILESVR_ADDRESS } from './config';
import LinesLayerWrapper from './components/layers/LinesLayerWrapper';

interface AppProps {
}

const App = () => {
  return (
    <ViewProvider>
      <LineProvider>
        <MapStateProvider startCenter={fromLonLat([-118.2362, 33.9616])} startZoom={13}>
          <div className="kts-app-container">
            <LineEditor></LineEditor>
            <NewLineForm></NewLineForm>
            <EditPointForm></EditPointForm>
            <MapProvider>
              <TileLayer theme={StandardTheme} tileServerAddress={`${TILESVR_ADDRESS}`} />
              <LinesLayerWrapper />
            </MapProvider>      
          </div>
        </MapStateProvider>
      </LineProvider>
    </ViewProvider>
  )
}

export default App;
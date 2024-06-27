import React from 'react'
import { fromLonLat } from 'ol/proj';
import { Core, Map } from 'ktsuilib';
import LineEditor from './components/LineEditor/LineEditor';

import './App.css';
import NewLineForm from './components/NewLineForm/NewLineForm';
import LineProvider from './contexts/line/LineProvider';
import ViewProvider from './contexts/view/ViewProvider';
import EditPointForm from './components/EditPointForm/EditPointForm';
import { TILESVR_ADDRESS } from './config';
import LinesLayerWrapper from './components/layers/LinesLayerWrapper';

const App = () => {
  return (
    <ViewProvider>
      <LineProvider>
        <Map.MapStateProvider startCenter={fromLonLat([-118.2362, 33.9616])} startZoom={13}>
          <Core.PageContainer>
            <Core.NavigationBar />
            <div className="kts-app-container">
              <LineEditor></LineEditor>
              <NewLineForm></NewLineForm>
              <EditPointForm></EditPointForm>
              <Map.MapProvider>
                <Map.TileLayer theme={Map.StandardTheme} tileServerAddress={`${TILESVR_ADDRESS}`} />
                <LinesLayerWrapper />
              </Map.MapProvider>      
            </div>
          </Core.PageContainer>
        </Map.MapStateProvider>
      </LineProvider>
    </ViewProvider>
  )
}

export default App;
import './LineEditor.css';

import React, { useContext, useEffect, useState } from "react";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import LineContext from "../../contexts/line/LineContext";
import { fromLonLat, toLonLat } from "ol/proj";
import { Map } from 'ktsuilib';
import { MapBrowserEvent } from 'ol';
import useEventEffect from '../../hooks/useEventEffect';

export default function LineEditor() {
  const { popup, setPopup } = useContext(ViewContext)!;
  const { currentLine, setCurrentLine, 
          currentPoint, setCurrentPoint,
          currentPath, setCurrentPath,
          addPoint, removePoint,
          lines, refreshLines,
          addPath, removePath, editingPaths, setEditingPaths,
          addStop, removeStop, 
          removeLine } = useContext(LineContext)!;
  const { setCenter, addClickAction, removeClickAction } = useContext(Map.MapStateContext)!;
  const [collapsed, setCollapsed] = useState(true);

  // console.log(lines);
  const currentLineObj = lines.find(ln => ln.lineid === currentLine);
  const currentPathObj = currentLineObj?.paths.find(p => p.pathid === currentPath);

  const newLine = () => {
    setPopup(PopupIds.ADD_LINE);
  }

  const selectLine = (id?: number) => {
    setCurrentLine(id);
    setCurrentPath(undefined);
  }

  const deleteLine = (id: number) => {
    removeLine(id); 
    refreshLines();
  }

  const modifyLine = (id: number) => {
    setPopup(PopupIds.EDIT_LINE);
    refreshLines();
  }

  const selectStop = (pos: number) => {
    const { lat, lng } = currentLineObj!.points[pos];
    setCenter?.(fromLonLat([lng, lat]))
    setCurrentPoint(pos);
  }

  const selectPoint = (pos: number) => {
    const { lat, lng } = currentPathObj!.points.find(pt => pt.order === pos)!;
    setCenter?.(fromLonLat([lng, lat]))
    setCurrentPoint(pos);
  }

  const modifyStop = (pos: number) => {
    setPopup(PopupIds.EDIT_STOP);
  }

  const deleteStop = (pos: number) => {
    removeStop(currentLineObj!.points[pos].linepointid);
    setCurrentLine(undefined);
  }

  const deletePoint = (pos: number) => {
    removePoint(pos);
    setCurrentLine(undefined);
  }

  const newPath = () => {
    addPath();
  }

  const deletePath = (id: number) => {
    removePath(id);
    setCurrentPath(undefined);
  }

  const addPointListener = useEventEffect((e: MapBrowserEvent<any>) => {
    if (!currentLine) return; //only add points to the selected line

    const currLine = lines.find(ln => ln.lineid === currentLine)!;
    const lonLat = toLonLat(e.coordinate);

    if (editingPaths) {
      //shape editor - add next point in the correct position
      addPoint({
        name: 'path-point',
        lat: lonLat[1],
        lng: lonLat[0],
        pathid: currentPath!,
        order: currentPoint || 0
      });
      setCurrentLine(undefined);
    } else {
      //stop editor - add stop to the list, order is not important
      addStop({
        name: 'additional-stop',
        lat: lonLat[1],
        lng: lonLat[0],
        lineid: currLine.lineid,
        request: false,
      });
      setCurrentLine(undefined);
    }
  });

  useEffect(() => {
    addClickAction(addPointListener);

    return () => removeClickAction(addPointListener);
  }, []);

  useEffect(() => {
    refreshLines();
  }, [popup]);

  return (
    <div className={`kts-line-editor ${collapsed ? 'kts-line-editor-collapsed' : ''}`}>
      {collapsed ? 
      <>
        <button onClick={() => setCollapsed(false)}>Show</button>
      </> :
      <>
        <button onClick={() => setCollapsed(true)}>Hide</button>
        <div className="kts-line-editor-lines">
          <div className="kts-line-editor-title">Lines</div>
          <button key="btn-clear-sel" onClick={() => selectLine(undefined)}>Clear selection</button>
          {lines.map(ln => {
            return (
              <div className={`kts-line-editor-line ${ln.lineid === currentLine ? 'kts-line-editor-current-line' : ''}`} 
                  key={ln.lineid}
                  onClick={() => selectLine(ln.lineid)}>
                <div className="kts-line-editor-circle" style={{background: ln.color}}></div>
                {ln.name}
                <button onClick={() => deleteLine(ln.lineid)}>X</button>
                <button onClick={() => modifyLine(ln.lineid)}>Edit</button>
              </div>
            )
          })}
          <button onClick={() => newLine()}>+ Add</button>
        </div>
        {
          currentLine ?
          <div className="kts-line-editor-bottom">
            <button className={`kts-line-editor-tab ${editingPaths ? 'kts-selected' : ''}`} onClick={() => setEditingPaths(true)}>Paths</button>
            <button className={`kts-line-editor-tab ${editingPaths ? '' : 'kts-selected'}`} onClick={() => setEditingPaths(false)}>Stops</button>
            <div className={`kts-line-editor-paths ${editingPaths ? '' : 'kts-hidden'}`}>
              {
                currentPath != null ? 
                  (
                    <>
                      <button key="btn-back" onClick={() => setCurrentPath(undefined)}>&lt;&lt;</button>
                      Path {currentPathObj!.pathid}
                      <div key="path-points" className='kts-line-editor-points'>
                        {currentPathObj!.points.map(point => {
                          return (
                            <div className={`kts-line-editor-point ${point.order === currentPoint ? 'kts-line-editor-current-point' : ''}`} 
                                key={point.order}
                                onClick={() => selectPoint(point.order)}>
                              Path Point
                              <button onClick={() => deletePoint(point.order)}>X</button>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) :
                  (
                    <>
                      <button key="btn-addpath" onClick={() => newPath()}>+</button>
                      {currentLineObj!.paths.map(path => {
                        return (
                          <div className={`kts-line-editor-path ${path.pathid === currentPath ? 'kts-line-editor-current-path' : ''}`} 
                              key={path.pathid}
                              onClick={() => setCurrentPath(path.pathid)}>
                            Path {path.pathid}
                            <button onClick={() => deletePath(path.pathid)}>X</button>
                          </div>
                        )
                      })}
                    </>
                  )
              }
            </div>
            <div className={`kts-line-editor-stops ${editingPaths ? 'kts-hidden' : ''}`}>
            {currentLineObj!.points.map((pt, index) => {
                return (
                  <div className={`kts-line-editor-line ${index === currentPoint ? 'kts-line-editor-current-line' : ''}`} 
                  key={pt.linepointid}
                  onClick={() => selectStop(index)}>
                    <div className="kts-line-editor-circle" style={{background: currentLineObj!.color}}></div>
                    {pt.name}
                    <button onClick={(e) => {
                      deleteStop(index);
                      e.stopPropagation();
                    }}>X</button>
                    <button onClick={() => modifyStop(index)}>Edit</button>
                  </div>
                )
              })}
            </div>
          </div>
          : <></>
        }
      </>}
    </div>
  )
}
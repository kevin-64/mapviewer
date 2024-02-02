import { Line } from "ktscore";
import './LineEditor.css';

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import LineContext from "../../contexts/line/LineContext";
import { fromLonLat } from "ol/proj";
import MapStateContext from "../../contexts/mapState/MapStateContext";

export default function LineEditor() {
  const { popup, setPopup } = useContext(ViewContext)!;
  const { currentLine, setCurrentLine,
          lines, refreshLines,
          updatePoint, removePoint,
          removeLine } = useContext(LineContext)!;
  const { setCenter } = useContext(MapStateContext)!;
  const [collapsed, setCollapsed] = useState(true);

  const currentLineObj = lines.find(ln => ln.lineid === currentLine);

  const newLine = () => {
    setPopup(PopupIds.ADD_LINE);
  }

  const selectLine = (id: number) => {
    setCurrentLine(id);
  }

  const deleteLine = (id: number) => {
    removeLine(id); 
    refreshLines();
  }

  const modifyLine = (id: number) => {
    setPopup(PopupIds.EDIT_LINE);
    refreshLines();
  }

  const selectPoint = (pos: number) => {
    const { lat, lng } = currentLineObj!.points[pos];
    setCenter?.(fromLonLat([lng, lat]))
  }

  const modifyPoint = (pos: number) => {
    //TODO
  }

  const deletePoint = (pos: number) => {
    removePoint(pos);
    setCurrentLine(undefined);
  }

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
        <div className="kts-line-editor-title">Lines</div>
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
        {
          currentLine ?
          <div className="kts-line-editor-points">
            <div className='kts-line-editor-title'>Points</div>
            {currentLineObj!.points.map((pt, index) => {
              return (
                <div className={`kts-line-editor-line`} 
                 key={pt.linepointid}
                 onClick={() => selectPoint(index)}>
                  <div className="kts-line-editor-circle" style={{background: currentLineObj!.color}}></div>
                  {pt.name}
                  <button onClick={(e) => {
                    deletePoint(index);
                    e.stopPropagation();
                  }}>X</button>
                  <button onClick={() => modifyPoint(index)}>Edit</button>
                </div>
              )
            })}
          </div>
          : <></>
        }
      </>}
    </div>
  )
}
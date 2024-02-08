import './EditPointForm.css';

import React, { useContext, useEffect, useState } from "react";
import LineContext from "../../contexts/line/LineContext";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import ViewMode from "../../contexts/view/ViewMode";
import { LinePoint } from 'ktscore';

export default function EditPointForm() {
  const { lines, currentLine, currentPoint, updatePoint } = useContext(LineContext)!;
  const { popup, setViewMode, setPopup } = useContext(ViewContext)!;
  const [name, setName] = useState('');
  const [request, setRequest] = useState(false);
  const [direction, setDirection] = useState(false);

  const isEditPoint = popup === PopupIds.EDIT_POINT;
  const currLineObj = lines.find(ln => ln.lineid === currentLine);

  useEffect(() => {
    if (currLineObj && isEditPoint) {
      const currPtObj = currLineObj.points[currentPoint!];
      setName(currPtObj.name);
      setRequest(currPtObj.request);
      setDirection(currPtObj.direction as any);
    } else {
      setName('');
      setRequest(false);
      setDirection(false);
    }
  }, [currentLine, currentPoint, popup]);

  const editPoint = () => {
    const currentPtObj = currLineObj!.points[currentPoint!] as any as LinePoint
    updatePoint({
      ...currentPtObj,
      name,
      request,
      direction: direction as any
    });
    close();
  }

  const close = () => {
    setViewMode(ViewMode.NORMAL);
    setPopup(undefined);
  }

  return (
    isEditPoint ? 
      <div className={`kts-edit-point-form`}>
        <button onClick={() => close()}>Close</button><br />
        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
        Request: <input type="checkbox" 
                            checked={request} 
                            onChange={(e) => setRequest(e.target.checked)}></input><br />
        Direction: <input type="checkbox" 
                            checked={direction} 
                            onChange={(e) => setDirection(e.target.checked)}></input><br />
        <button onClick={() => editPoint()}>Update</button>
      </div> : <></>
  )
}
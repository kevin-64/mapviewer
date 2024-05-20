import './EditPointForm.css';

import React, { useContext, useEffect, useState } from "react";
import LineContext from "../../contexts/line/LineContext";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import ViewMode from "../../contexts/view/ViewMode";
import { LinePoint } from 'ktscore';

export default function EditPointForm() {
  const { lines, currentLine, currentPoint, updateStop } = useContext(LineContext)!;
  const { popup, setViewMode, setPopup } = useContext(ViewContext)!;
  const [name, setName] = useState('');
  const [request, setRequest] = useState(false);

  const isEditStop = popup === PopupIds.EDIT_STOP;
  const currLineObj = lines.find(ln => ln.lineid === currentLine);

  useEffect(() => {
    if (currLineObj && isEditStop) {
      const currPtObj = currLineObj.points[currentPoint!];
      setName(currPtObj.name);
      setRequest(currPtObj.request);
    } else {
      setName('');
      setRequest(false);
    }
  }, [currentLine, currentPoint, popup]);

  const editPoint = () => {
    const currentPtObj = currLineObj!.points[currentPoint!] as any as LinePoint
    updateStop({
      ...currentPtObj,
      name,
      request,
    });
    close();
  }

  const close = () => {
    setViewMode(ViewMode.NORMAL);
    setPopup(undefined);
  }

  return (
    isEditStop ? 
      <div className={`kts-edit-point-form`}>
        <button onClick={() => close()}>Close</button><br />
        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
        Request: <input type="checkbox"
                            disabled={!stop} 
                            checked={request} 
                            onChange={(e) => setRequest(e.target.checked)}></input><br />
        <button onClick={() => editPoint()}>Update</button>
      </div> : <></>
  )
}
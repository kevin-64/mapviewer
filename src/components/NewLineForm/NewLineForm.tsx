import './NewLineForm.css';

import React, { useContext, useEffect, useState } from "react";
import LineContext from "../../contexts/line/LineContext";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import ViewMode from "../../contexts/view/ViewMode";

export default function NewLineForm() {
  const { addLine, updateLine, lines, currentLine } = useContext(LineContext)!;
  const { popup, setViewMode, setPopup } = useContext(ViewContext)!;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const currLineObj = lines.find(ln => ln.lineid === currentLine);
    if (currLineObj && popup === PopupIds.EDIT_LINE) {
      setName(currLineObj.name);
      setDescription(currLineObj.description);
      setColor(currLineObj.color);
    } else {
      setName('');
      setDescription('');
      setColor('');
    }
  }, [currentLine, popup]);

  const newLine = () => {
    addLine({
      name,
      description,
      color
    });
    close();
  }

  const editLine = () => {
    updateLine({
      lineid: currentLine!,
      name,
      description,
      color
    });
    close();
  }

  const close = () => {
    setViewMode(ViewMode.NORMAL);
    setPopup(undefined);
  }

  const isAdd = popup === PopupIds.ADD_LINE;
  const isUpdate = popup === PopupIds.EDIT_LINE;

  return (
    (isAdd || isUpdate) ? 
      <div className={`kts-new-line-form`}>
        <button onClick={() => close()}>Close</button><br />
        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
        Description: <input type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}></input><br />
        Color: <input type="text"
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}></input><br />
        <button onClick={() => isAdd ? newLine() : editLine()}>{isAdd ? "Add" : "Update"}</button>
      </div> : <></>
  )
}
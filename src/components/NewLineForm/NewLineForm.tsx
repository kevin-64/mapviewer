import './NewLineForm.css';

import React, { useContext, useState } from "react";
import LineContext from "../../contexts/line/LineContext";
import ViewContext from "../../contexts/view/ViewContext";
import PopupIds from "../../contexts/view/PopupIds";
import ViewMode from "../../contexts/view/ViewMode";

export default function NewLineForm() {
  const { addLine } = useContext(LineContext)!;
  const { popup, setViewMode, setPopup } = useContext(ViewContext)!;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  const newLine = () => {
    addLine({
      name,
      description,
      color
    });
    close();
  }

  const close = () => {
    setViewMode(ViewMode.NORMAL);
    setPopup(undefined);
    setName('');
    setDescription('');
    setColor('');
  }

  return (
    (popup !== PopupIds.ADD_LINE) ? <></> : 
      <div className={`kts-new-line-form`}>
        <button onClick={() => close()}>Close</button><br />
        Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br />
        Description: <input type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}></input><br />
        Color: <input type="text"
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}></input><br />
        <button onClick={() => newLine()}>Add</button>
      </div>
  )
}
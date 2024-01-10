import React, { useMemo, useState } from "react";
import ViewContextType from "./ViewContextType";
import ViewContext from './ViewContext';
import ViewMode from "./ViewMode";
import PopupIds from "./PopupIds";

export default function LineProvider(props: React.PropsWithChildren) {
  const [viewMode, viewModeSet] = useState(ViewMode.NORMAL);
  const [popup, popupSet] = useState<PopupIds | undefined>();

  const provider = useMemo<ViewContextType>(() => {
    return {
      viewMode,
      popup,

      setViewMode: (mode: ViewMode) => {
        viewModeSet(mode)
      },

      setPopup: (pid?: PopupIds) => {
        popupSet(pid)
      }
    }
  }, [viewMode, popup]);

  return (
    <ViewContext.Provider value={provider}>
      {props.children}
    </ViewContext.Provider>
  )
}
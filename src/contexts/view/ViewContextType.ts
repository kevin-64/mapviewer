import ViewMode from "./ViewMode";
import PopupIds from "./PopupIds";

export default interface ViewContextType {
  viewMode: ViewMode
  popup?: PopupIds

  setViewMode: (mode: ViewMode) => void
  setPopup: (pid?: PopupIds) => void
}
import { Line, Point } from "ktscore";

export type LineRecord = Omit<Line, 'lineid'>;
export type PointRecord = Omit<Point, 'pointid'>;

export default interface LineContextType {
  lines: Line[]
  currentLine?: number;

  refreshLines: () => void
  
  addLine: (ln: LineRecord) => void
  updateLine: (ln: LineRecord) => void
  removeLine: (id: number) => void

  setCurrentLine: (id?: number) => void

  addPoint: (pt: PointRecord, pos: number) => void
  removePoint: (pos: number) => void
}
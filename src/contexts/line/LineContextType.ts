import { Line, LinePoint, Point } from "ktscore";

export type LineRecord = Omit<Line, 'lineid'>;
export type PointRecord = Omit<Point, 'pointid'>;
export type LinePointRecord = PointRecord & Omit<LinePoint, 'linepointid' | 'pointid'>;
export type LineWithPoints = Line & { points: (PointRecord & Omit<LinePoint, 'pointid'>)[]}

export default interface LineContextType {
  lines: LineWithPoints[]
  currentLine?: number;
  pointOfInsertion?: number;

  setPointOfInsertion: (poi: number) => void

  refreshLines: () => void
  
  addLine: (ln: LineRecord) => void
  updateLine: (ln: Line) => void
  removeLine: (id: number) => void

  setCurrentLine: (id?: number) => void

  addPoint: (pt: LinePointRecord) => void
  updatePoint: (pt: LinePoint) => void
  removePoint: (pos: number) => void
}
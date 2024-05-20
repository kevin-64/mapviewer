import { Line, LinePoint, PathPoint, PathWithPoints, Point } from "ktscore";

export type LineRecord = Omit<Line, 'lineid'>;
export type PointRecord = Omit<Point, 'pointid'>;
export type PathPointRecord = Omit<PathPoint, 'pointid'>;
export type LinePointRecord = PointRecord & Omit<LinePoint, 'linepointid' | 'pointid'>;
export type LineWithPoints = Line & { 
  points: (PointRecord & Omit<LinePoint, 'pointid'>)[],
  paths: PathWithPoints[]
}

export default interface LineContextType {
  lines: LineWithPoints[]
  currentLine?: number;
  currentPoint?: number;
  currentPath?: number;
  editingPaths: boolean;
  
  refreshLines: () => void
  
  addLine: (ln: LineRecord) => void
  updateLine: (ln: Line) => void
  removeLine: (id: number) => void
  
  setEditingPaths: (b: boolean) => void
  setCurrentLine: (id?: number) => void
  setCurrentPoint: (pt: number) => void
  setCurrentPath: (p?: number) => void

  addPoint: (pt: PathPointRecord & PointRecord) => void
  updatePoint: (pt: LinePoint) => void
  removePoint: (pos: number) => void

  addStop: (s: LinePointRecord) => void
  updateStop: (s: LinePoint) => void
  removeStop: (id: number) => void

  addPath: () => void
  removePath: (p: number) => void
}
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import LineContextType, { LinePointRecord, LineRecord, LineWithPoints } from "./LineContextType";
import LineContext from './LineContext';
import axios from "axios";
import { Line, LinePoint } from "ktscore";

export default function LineProvider(props: PropsWithChildren) {
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<number | undefined>(undefined);
  const [lines, setLines] = useState<LineWithPoints[]>([]);

  const loadLines = () => {
    axios.get('http://localhost:8080/lines').then((res) => {
      setLines(res.data as LineWithPoints[]);
     });
  }

  useEffect(() => {
    loadLines();
  }, []);

  const provider = useMemo<LineContextType>(() => {
    return {
      lines,
      currentLine: selectedLine,
      currentPoint: selectedPoint,

      refreshLines: () => {
        loadLines();
      },

      addLine: (ln: LineRecord) => {
        axios.post('http://localhost:8080/lines', {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      updateLine: (ln: Line) => {
        axios.put(`http://localhost:8080/lines/${ln.lineid}`, {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      removeLine: (id: number) => {
        axios.delete(`http://localhost:8080/lines/${id}`).then(resp => {
          console.log(resp);
          if (selectedLine === id) setSelectedLine(undefined);
        });
      },

      setCurrentLine: (id?: number) => {
        setSelectedLine(id);
      },
      setCurrentPoint: (pos: number) => {
        setSelectedPoint(pos);
      },
      addPoint: (pt: LinePointRecord) => {
        const lineId = pt.lineid;
        axios.post('http://localhost:8080/points', {
          ...pt,
        }).then(resp => {
          console.log(resp);

          lines.find(ln => ln.lineid === lineId)?.points.splice(pt.order, 0, { ...pt, linepointid: resp.data });
          setSelectedLine(lineId);
        });
      },
      updatePoint: (pt: LinePoint) => {
        axios.patch(`http://localhost:8080/linepoints/${pt.linepointid}`, {
          ...pt
        }).then(resp => {
          console.log(resp);
        });
      },
      removePoint: (pos: number) => {
        const selLine = lines.find(ln => ln.lineid === selectedLine)!
        const lineId = selLine.lineid;
        const linepointid = selLine.points[pos].linepointid;
        axios.delete(`http://localhost:8080/linepoints/${linepointid}`).then(resp => {
          console.log(resp);

          lines.find(ln => ln.lineid === lineId)?.points.splice(pos, 1);
          setSelectedLine(lineId);
          setSelectedPoint(undefined);
        })
      },
    }
  }, [selectedLine, selectedPoint, lines]);

  return (
    <LineContext.Provider value={provider}>
      {props.children}
    </LineContext.Provider>
  )
}
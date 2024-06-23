import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import LineContextType, { LinePointRecord, LineRecord, LineWithPoints, PathPointRecord, PointRecord } from "./LineContextType";
import LineContext from './LineContext';
import { LineContext as LayerLineContext } from "ktsuilib";
import axios from "axios";
import { Line, LinePoint } from "ktscore";
import { BACKEND_ADDRESS } from "../../config";

export default function LineProvider(props: PropsWithChildren) {
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<number | undefined>(undefined);
  const [selectedPath, setSelectedPath] = useState<number | undefined>(undefined);
  const [editPaths, setEditPaths] = useState(false);
  const [lines, setLines] = useState<LineWithPoints[]>([]);

  const loadLines = async () => {
    return axios.get(`${BACKEND_ADDRESS}/lines`).then((res) => {
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
      currentPath: selectedPath,
      editingPaths: editPaths,

      refreshLines: () => {
        let newSelPointId: number | undefined = undefined;
        if (selectedPoint != null) {
          newSelPointId = lines.find(ln => ln.lineid === selectedLine)!.points[selectedPoint].linepointid;
        }
        loadLines().then(() => {
          const index = lines.find(ln => ln.lineid === selectedLine)?.points.findIndex(pt => pt.linepointid === newSelPointId);
          setSelectedPoint(index !== -1 ? index : undefined);
        });
      },

      addLine: (ln: LineRecord) => {
        axios.post(`${BACKEND_ADDRESS}/lines`, {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      updateLine: (ln: Line) => {
        axios.put(`${BACKEND_ADDRESS}/lines/${ln.lineid}`, {
          ...ln
        }).then(resp => {
          console.log(resp);
        });
      },
      removeLine: (id: number) => {
        axios.delete(`${BACKEND_ADDRESS}/lines/${id}`).then(resp => {
          console.log(resp);
          if (selectedLine === id) setSelectedLine(undefined);
        });
      },

      setEditingPaths: (b: boolean) => {
        setEditPaths(b);
      },
      setCurrentLine: (id?: number) => {
        setSelectedLine(id);
      },
      setCurrentPoint: (pos: number) => {
        setSelectedPoint(pos);
      },
      setCurrentPath: (p?: number) => {
        setSelectedPath(p);
      },
      addPoint: (pt: PathPointRecord & PointRecord) => {
        const selLine = selectedLine;
        axios.post(`${BACKEND_ADDRESS}/lines/${selectedLine}/paths/${selectedPath}/points`, {
          ...pt,
        }).then(resp => {
          console.log(resp);

          const paths = lines.find(ln => ln.lineid === selectedLine)?.paths;
          const newPt = { ...pt, pointid: resp.data as number};

          const selectedPathPoints = paths?.find(p => p.pathid === selectedPath)?.points!;
          selectedPathPoints.forEach((point, index) => {
            if (point.order >= newPt.order) selectedPathPoints[index].order++
          });
          selectedPathPoints.splice(pt.order, 0, newPt);
          setSelectedLine(selLine);
        });
      },
      updatePoint: (pt: LinePoint) => {
        axios.patch(`${BACKEND_ADDRESS}/linepoints/${pt.linepointid}`, {
          ...pt
        }).then(resp => {
          console.log(resp);
        });
      },
      removePoint: (pos: number) => {
        const selLine = selectedLine;
        const points = lines.find(ln => ln.lineid === selLine)?.paths.find(path => path.pathid === selectedPath)?.points;
        const indexToRemove = points!.findIndex(point => point.order === pos);
        axios.delete(`${BACKEND_ADDRESS}/lines/${selLine}/paths/${selectedPath}/points/${pos}`).then(resp => {
          console.log(resp);

          points!.splice(indexToRemove, 1);

          setSelectedLine(selLine);
          setSelectedPoint(undefined);
        })
      },

      addStop: (stop: LinePointRecord) => {
        const lineId = stop.lineid;
        axios.post(`${BACKEND_ADDRESS}/lines/${lineId}/points`, {
          ...stop,
        }).then(resp => {
          console.log(resp);

          lines.find(ln => ln.lineid === lineId)?.points.push({ ...stop, linepointid: resp.data });
          setSelectedLine(lineId);
        });
      },
      updateStop: (stop: LinePoint) => {
        axios.patch(`${BACKEND_ADDRESS}/lines/${stop.lineid}/points/${stop.linepointid}`, {
          ...stop
        }).then(resp => {
          console.log(resp);
        });
      },
      removeStop: (id: number) => {
        const selLine = lines.find(ln => ln.lineid === selectedLine)!
        const lineId = selLine.lineid;
        axios.delete(`${BACKEND_ADDRESS}/lines/${lineId}/points/${id}`).then(resp => {
          console.log(resp);

          const points = lines.find(ln => ln.lineid === lineId)?.points;
          if (points) {
            const stopIndex = points.findIndex(pt => pt.linepointid === id);
            points.splice(stopIndex, 1);
          }

          setSelectedLine(lineId);
          setSelectedPoint(undefined);
          setSelectedPath(undefined);
        })
      },

      addPath: () => {
        const selLine = selectedLine;
        const lineId = lines.find(ln => ln.lineid === selLine)!.lineid;
        setSelectedLine(undefined);
        axios.post(`${BACKEND_ADDRESS}/lines/${lineId}/paths`, {
          lineid: lineId
        }).then(resp => {
          console.log(resp);
          lines.find(ln => ln.lineid === selectedLine)!.paths.push({
            lineid: lineId,
            pathid: resp.data as number,
            points: []
          });
          setSelectedLine(selLine);
        });
      },
      removePath: (pathid: number) => {
        axios.delete(`${BACKEND_ADDRESS}/lines/${selectedLine}/paths/${pathid}`).then(resp => {
          console.log(resp);
          const paths = lines.find(ln => ln.lineid === selectedLine)!.paths;
          const pathIndex = paths.findIndex(p => p.pathid === pathid);
          paths.splice(pathIndex, 1);
          setSelectedPath(undefined);
        });
      }
    }
  }, [selectedLine, selectedPoint, selectedPath, lines, editPaths]);

  return (
      <LineContext.Provider value={provider}>
        <LayerLineContext.Provider value={provider}>
          {props.children}
        </LayerLineContext.Provider>
      </LineContext.Provider>
  )
}
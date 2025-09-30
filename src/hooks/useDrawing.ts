import { useState } from 'react';
import { Point, Stroke } from '../types';

export const useDrawing = () => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);

  const startDrawing = (point: Point, color: string, width: number) => {
    const newStroke = {
      id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      color,
      width,
      points: [point]
    };
    setCurrent(newStroke);
    setRedoStack([]);
  };

  const updateDrawing = (point: Point) => {
    setCurrent(currentStroke => 
      currentStroke ? {
        ...currentStroke,
        points: [...currentStroke.points, point],
      } : null
    );
  };

  const finishDrawing = () => {
    setCurrent(currentStroke => {
      if (currentStroke && currentStroke.points.length > 1) {
        setStrokes(prev => [...prev, currentStroke]);
      }
      return null;
    });
  };

  const undo = () => {
    setStrokes((s) => {
      if (s.length === 0) return s;
      const last = s[s.length - 1];
      setRedoStack((r) => [...r, last]);
      return s.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const last = r[r.length - 1];
      setStrokes((s) => [...s, last]);
      return r.slice(0, -1);
    });
  };

  const clearStrokes = () => {
    setStrokes([]);
    setRedoStack([]);
    setCurrent(null);
  };

  const setStrokesFromData = (newStrokes: Stroke[]) => {
    setStrokes(newStrokes);
    setRedoStack([]);
    setCurrent(null);
  };

  return {
    strokes,
    redoStack,
    current,
    startDrawing,
    updateDrawing,
    finishDrawing,
    undo,
    redo,
    clearStrokes,
    setStrokesFromData,
  };
};
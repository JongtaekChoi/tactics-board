import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Stroke } from '../../types';

interface SvgOverlayProps {
  strokes: Stroke[];
  selectedStrokeId?: string | null;
}

function strokeToPath(stroke: Stroke): string {
  if (stroke.points.length === 0) return '';
  
  const [start, ...rest] = stroke.points;
  let path = `M ${start.x} ${start.y}`;
  
  rest.forEach(point => {
    path += ` L ${point.x} ${point.y}`;
  });
  
  return path;
}

export default function SvgOverlay({ strokes, selectedStrokeId }: SvgOverlayProps) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      {strokes.map((stroke, index) => {
        const isSelected = stroke.id === selectedStrokeId;
        return (
          <Path
            key={stroke.id || index}
            d={strokeToPath(stroke)}
            stroke={isSelected ? '#FFD700' : stroke.color}
            strokeWidth={isSelected ? stroke.width + 2 : stroke.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isSelected ? '10,5' : undefined}
            fill="none"
          />
        );
      })}
    </Svg>
  );
}
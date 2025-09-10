import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Stroke } from '../../types';

interface SvgOverlayProps {
  strokes: Stroke[];
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

export default function SvgOverlay({ strokes }: SvgOverlayProps) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      {strokes.map((stroke, index) => (
        <Path
          key={index}
          d={strokeToPath(stroke)}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </Svg>
  );
}
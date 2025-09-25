import { Dimensions } from "react-native";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BoardDimensions {
  width: number;
  height: number;
  availableWidth: number;
  availableHeight: number;
  boardWidth: number;
  boardHeight: number;
  aspectRatio: number;
}

interface BoardContextValue {
  dimensions: BoardDimensions;
  BOARD_WIDTH: number;
  BOARD_HEIGHT: number;
  TOKEN_SIZE: number;
  TOKEN_RADIUS: number;
  SELECTION_RADIUS: number;
  isReady: boolean;
}

const BoardContext = createContext<BoardContextValue | undefined>(undefined);

export const useBoardDimensions = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardDimensions must be used within BoardProvider");
  }
  return context;
};

interface BoardProviderProps {
  children: ReactNode;
}

// 동적 토큰 크기 계산 함수
const calculateTokenSize = (boardWidth: number, boardHeight: number): number => {
  // 보드 크기 기준으로 토큰 크기 계산 (보드 크기의 8%)
  const baseSize = Math.min(boardWidth, boardHeight) * 0.08;
  // 최소 28px, 최대 48px로 제한
  return Math.max(28, Math.min(48, Math.round(baseSize)));
};

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState<BoardDimensions | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const updateDimensions = () => {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");


      // 사용 가능한 영역 계산
      // - SafeArea insets 고려
      // - 상단 헤더 영역 (약 60px) 고려
      // - 하단 툴바 영역 (약 80px) 고려
      // - ColorPicker 영역 (약 60px, draw 모드일 때만) 여유분 고려
      const headerHeight = 60;
      const toolbarHeight = 80;
      const colorPickerHeight = 60; // 여유분으로 항상 고려
      const padding = 20; // 좌우 여백

      const availableWidth = screenWidth - padding - insets.left - insets.right;
      const availableHeight =
        screenHeight -
        insets.top - // SafeArea top
        insets.bottom -
        headerHeight -
        toolbarHeight -
        colorPickerHeight;

      // 축구장 비율 (FIFA 규격: 90-120m x 45-90m, 일반적으로 105m x 68m)
      // 세로 축구장이므로 height가 더 길어야 함 (약 1.55 비율)
      const idealAspectRatio = 1.55;

      let boardWidth: number;
      let boardHeight: number;

      // 사용 가능한 영역에 맞춰 보드 크기 계산
      const widthBasedHeight = availableWidth * idealAspectRatio;
      const heightBasedWidth = availableHeight / idealAspectRatio;

      if (widthBasedHeight <= availableHeight) {
        // 너비 기준으로 크기 결정
        boardWidth = availableWidth;
        boardHeight = widthBasedHeight;
      } else {
        // 높이 기준으로 크기 결정
        boardWidth = heightBasedWidth;
        boardHeight = availableHeight;
      }

      // 최소 크기 보장
      const minWidth = 300;
      const minHeight = minWidth * idealAspectRatio;

      boardWidth = Math.max(boardWidth, minWidth);
      boardHeight = Math.max(boardHeight, minHeight);

      // 최종 사용할 보드 크기가 사용 가능 영역을 초과하지 않도록 재조정
      if (boardWidth > availableWidth) {
        boardWidth = availableWidth;
        boardHeight = boardWidth * idealAspectRatio;
      }

      if (boardHeight > availableHeight) {
        boardHeight = availableHeight;
        boardWidth = boardHeight / idealAspectRatio;
      }

      const newDimensions: BoardDimensions = {
        width: screenWidth,
        height: screenHeight,
        availableWidth,
        availableHeight,
        boardWidth,
        boardHeight,
        aspectRatio: boardHeight / boardWidth,
      };

      setDimensions(newDimensions);
    };

    // 초기 계산
    updateDimensions();

    // 화면 회전 등에 대응
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );

    return () => {
      subscription?.remove();
    };
  }, [insets]);

  // 동적 토큰 크기 계산
  const tokenSize = dimensions
    ? calculateTokenSize(dimensions.boardWidth, dimensions.boardHeight)
    : 32; // 기본값
  const tokenRadius = tokenSize / 2;
  const selectionRadius = tokenRadius + 8; // 터치 감지 영역을 약간 크게

  const contextValue: BoardContextValue = {
    dimensions: dimensions || {
      width: 0,
      height: 0,
      availableWidth: 0,
      availableHeight: 0,
      boardWidth: 350,
      boardHeight: 350 * 1.55,
      aspectRatio: 1.55,
    },
    BOARD_WIDTH: dimensions?.boardWidth || 350,
    BOARD_HEIGHT: dimensions ? dimensions.boardHeight : 350 * 1.55,
    TOKEN_SIZE: tokenSize,
    TOKEN_RADIUS: tokenRadius,
    SELECTION_RADIUS: selectionRadius,
    isReady: dimensions !== null,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
};

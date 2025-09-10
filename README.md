# ⚽ 축구 전술 보드 (Soccer Tactics Board)

> **React Native + Expo 기반 인터랙티브 축구 전술 보드 앱**  
> 터치 드로잉, 플레이어 드래그, Undo/Redo, PNG 내보내기까지 핵심 전술보드 기능을 담았습니다.

![React Native](https://img.shields.io/badge/React_Native-0.79.6-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-~53.0.22-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ 주요 기능

### 🎯 핵심 인터랙션
- **플레이어 토큰 이동**: 홈/어웨이 11명 + 축구공 터치로 선택 및 드래그
- **터치 드로잉**: 손가락으로 패스/이동 경로 그리기 (SVG Path 기반)
- **더블탭 편집**: 선수 번호/이름 더블탭으로 편집
- **직관적 UI**: 탭-투-셀렉트로 정확한 선택 후 이동

### 📝 상태 관리
- **통합 Undo/Redo**: 드로잉, 플레이어 이동, 텍스트 편집 모두 지원
- **Reset 기능**: 모든 상태를 초기값으로 복원
- **실시간 버튼 상태**: Undo/Redo 가능 여부에 따른 UI 피드백

### 💾 저장 & 공유
- **Save/Save As**: 덮어쓰기와 새 이름으로 저장 분리
- **AsyncStorage 저장**: 여러 전술판 저장/불러오기
- **PNG 내보내기**: 화면 캡처 후 시스템 공유 기능

### 🎨 사용자 경험
- **아이콘 기반 UI**: Expo Vector Icons로 직관적인 버튼
- **모드별 UI**: 그리기 모드일 때만 색상/굵기 선택기 표시
- **반응형 제스처**: Reanimated 기반 부드러운 터치 인터랙션

## 🛠 기술 스택

### Core
- **React Native 0.79.6**: iOS/Android 크로스 플랫폼
- **Expo SDK 53**: 개발 도구 및 네이티브 API 접근
- **TypeScript**: 타입 안전성

### UI & 애니메이션
- **React Native Reanimated**: 60fps 부드러운 애니메이션
- **React Native Gesture Handler**: 고성능 제스처 처리
- **React Native SVG**: 벡터 기반 드로잉 렌더링
- **Expo Vector Icons**: 아이콘 시스템

### 네비게이션 & 저장
- **React Navigation**: 스택 기반 화면 네비게이션
- **AsyncStorage**: 로컬 데이터 지속성
- **React Native View Shot**: 화면 캡처
- **Expo Sharing**: 네이티브 공유 기능

## 🚀 빠른 시작

### 필요 조건
- Node.js 16+
- Expo CLI
- iOS Simulator 또는 Android Emulator (선택사항)
- Expo Go 앱 (물리 디바이스 테스트용)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/tactics-board.git
cd tactics-board

# 의존성 설치
yarn install

# 개발 서버 시작
npx expo start

# 플랫폼별 실행
npx expo start --ios      # iOS
npx expo start --android  # Android
npx expo start --web      # Web
```

### 개발 환경 설정

```bash
# iOS (macOS만 가능)
# Xcode 및 iOS Simulator 설치 필요

# Android
# Android Studio 및 Android SDK 설치 필요

# 물리 디바이스
# Expo Go 앱 설치 후 QR 코드 스캔
```

## 📱 사용법

### 기본 조작
1. **이동 모드**: 플레이어/공을 탭하여 선택 → 원하는 위치 탭
2. **그리기 모드**: 손가락으로 드래그하여 선 그리기
3. **편집**: 플레이어를 더블탭하여 번호/이름 편집

### 툴바 버튼
- **↩️ Undo**: 마지막 액션 취소
- **↪️ Redo**: 취소한 액션 복구  
- **🔄 Reset**: 모든 상태 초기화
- **💾 Save**: 현재 전술판 저장
- **📋 Save As**: 새 이름으로 저장
- **📁 Load**: 저장된 전술판 불러오기
- **📤 Share**: PNG로 내보내기

### 그리기 도구
- **색상 선택**: 빨강, 파랑, 노랑, 흰색
- **선 굵기**: 1px ~ 8px 조절 가능
- **SVG 렌더링**: 확대해도 깨지지 않는 벡터 그래픽

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── board/           # 전술보드 관련 컴포넌트
│   │   ├── TacticsBoard.tsx    # 메인 보드 컨테이너
│   │   ├── Token.tsx           # 플레이어/공 토큰
│   │   ├── Pitch.tsx           # 축구장 배경
│   │   └── SvgOverlay.tsx      # SVG 드로잉 레이어
│   └── ui/              # 공통 UI 컴포넌트
│       ├── Button.tsx          # 아이콘 버튼
│       ├── Toolbar.tsx         # 상단 툴바
│       ├── ColorPicker.tsx     # 색상/굵기 선택
│       └── TextEditModal.tsx   # 텍스트 편집 모달
├── hooks/               # 커스텀 React Hooks
│   ├── useBoardState.ts        # 통합 보드 상태 관리
│   ├── useHistory.ts           # Undo/Redo 히스토리
│   ├── useGestures.ts          # 제스처 처리
│   └── useStorage.ts           # AsyncStorage 래퍼
├── screens/             # 화면 컴포넌트
│   ├── HomeScreen.tsx          # 홈/목록 화면
│   └── BoardScreen.tsx         # 메인 전술보드 화면
├── types/               # TypeScript 타입 정의
│   ├── index.ts               # 공통 타입
│   └── navigation.ts          # 네비게이션 타입
└── utils/               # 유틸리티 함수
    ├── constants.ts           # 상수 정의
    └── helpers.ts             # 헬퍼 함수
```

## 🎯 아키텍처 특징

### 상태 관리 패턴
```typescript
// 통합된 히스토리 시스템
type HistoryAction = 
  | { type: 'DRAW_STROKE'; stroke: Stroke }
  | { type: 'MOVE_PLAYER'; playerId: string; x: number; y: number }
  | { type: 'UPDATE_PLAYER_LABEL'; playerId: string; label: string };

// 모든 액션이 히스토리에 저장되어 undo/redo 가능
```

### 제스처 시스템
```typescript
// 제스처 우선순위: 그리기 > 더블탭 > 단일탭
const composedGesture = Gesture.Exclusive(drawPan, doubleTap, tap);
```

### 렌더링 최적화
```typescript
// SVG Path로 효율적인 선 렌더링
function strokeToPath(stroke: Stroke): string {
  const [start, ...rest] = stroke.points;
  let path = `M ${start.x} ${start.y}`;
  rest.forEach(point => path += ` L ${point.x} ${point.y}`);
  return path;
}
```

## 🧪 테스트 체크리스트

- [x] 드로잉 시작/이동/종료가 부드럽게 동작
- [x] Undo/Redo가 모든 액션(드로잉/이동/편집)에서 작동
- [x] 탭-투-셀렉트 시스템이 정확하게 동작
- [x] 더블탭으로 텍스트 편집 모달 정상 작동
- [x] PNG Export 결과가 화면과 동일하게 저장
- [x] 저장/불러오기가 정상 동작 (앱 재시작 후에도 유지)
- [x] Save/Save As 기능 분리
- [x] 아이콘 기반 직관적 UI

## 📈 성능 최적화

### 렌더링 성능
- **SVG Path 사용**: 개별 View 세그먼트 → 단일 Path 요소
- **제스처 최적화**: Reanimated worklet으로 UI 스레드 차단 방지
- **조건부 렌더링**: 그리기 모드일 때만 ColorPicker 렌더링

### 메모리 관리
- **히스토리 제한**: 무한 확장 방지를 위한 히스토리 스택 관리
- **이미지 최적화**: PNG 캡처 시 적절한 해상도/품질 설정

## 🔮 확장 가능성

### 단기 개선사항
- [ ] 포메이션 프리셋 (4-3-3, 4-4-2, 3-5-2 등)
- [ ] 전체/하프 코트 토글
- [ ] 세트피스 템플릿 (코너킥, 프리킥)
- [ ] 다중 레이어 (런/패스/프레싱)

### 장기 로드맵
- [ ] 실시간 협업 (다중 사용자)
- [ ] 클라우드 동기화
- [ ] 비디오 분석 연동
- [ ] AI 전술 추천
- [ ] 3D 시각화

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License로 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 크레딧

- **아이콘**: [Expo Vector Icons](https://icons.expo.fyi/)
- **제스처**: [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- **애니메이션**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **SVG**: [React Native SVG](https://github.com/software-mansion/react-native-svg)

---

**Made with ❤️ for Football Coaches and Tactical Enthusiasts**
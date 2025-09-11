# ⚽ 축구 전술 보드 (Soccer Tactics Board)

> **완전한 축구 전술 계획 앱** — 포메이션 프리셋, 인터랙티브 드로잉, 애니메이션 선수 이동까지  
> **현재 배포 준비 완료** 상태로 App Store 및 Play Store 출시 가능합니다.

![React Native](https://img.shields.io/badge/React_Native-0.79.6-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-~53.0.22-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ 완성된 주요 기능

### ⚽ 전술 설정 시스템
- **3단계 Progressive UI**: 팀 선택 → 인원 수 → 전술 유형 (애니메이션 플로우)
- **6가지 포메이션 프리셋**: 4-4-2, 4-3-3, 3-5-2, 4-2-3-1, 5-3-2, 세트피스
- **시나리오별 초기화**: 선택한 전술에 따른 실제 축구 전술 기반 선수 배치
- **11vs11 전용**: 실제 축구 전술에 최적화된 선수 배치 시스템

### 🏟️ 완전한 축구장 구현
- **골포스트**: 상하단 골라인 + 좌우 골포스트 세부 구현
- **페널티박스**: 18야드 박스 + 6야드 골에리어
- **센터서클**: 킥오프 포인트 + 하프라인
- **현실감 있는 축구장**: 실제 축구장 비율 반영

### 🎯 애니메이션 인터랙션 
- **SharedValue 드래그**: 60fps 부드러운 선수 이동 (히스토리 오염 방지)
- **시각적 피드백**: 드래그 중 스케일/투명도/Z-Index 변화
- **터치 최적화**: 탭-투-셀렉트 + 더블탭 편집 시스템
- **SVG 벡터 드로잉**: 확대 가능한 패스 경로 그리기

### 📝 상태 관리 시스템
- **스마트 리셋**: 초기 전술 또는 마지막 저장 상태로 복원
- **통합 Undo/Redo**: 드로잉 + 선수 이동 + 텍스트 편집
- **다중 저장**: Save/Save As 분리로 덮어쓰기/새 저장 구분
- **AsyncStorage**: 로컬 전술판 저장 및 목록 관리

### 🎨 한국어 다크테마 UI
- **전문적 디자인**: 코치용 다크테마로 집중력 향상
- **아이콘 기반**: Expo Vector Icons 직관적 버튼 시스템
- **반응형**: 다양한 화면 크기 지원

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
- [x] SharedValue 기반 애니메이션 드래그 시스템 구현

## 📈 성능 최적화

### 렌더링 성능
- **SVG Path 사용**: 개별 View 세그먼트 → 단일 Path 요소
- **제스처 최적화**: Reanimated worklet으로 UI 스레드 차단 방지
- **조건부 렌더링**: 그리기 모드일 때만 ColorPicker 렌더링

### 메모리 관리
- **히스토리 제한**: 무한 확장 방지를 위한 히스토리 스택 관리
- **이미지 최적화**: PNG 캡처 시 적절한 해상도/품질 설정

## 📋 개발 현황

### ✅ v1.0.0 완성 (배포 준비 완료)
- [x] **포메이션 시스템**: 6가지 11vs11 포메이션 프리셋 완료
- [x] **배포 준비**: EAS Build 설정, 번들 식별자, TypeScript 컴파일 통과
- [x] **완전한 축구장**: 골포스트, 페널티박스, 골에리어 구현  
- [x] **애니메이션 드래그**: SharedValue 기반 60fps 부드러운 인터랙션
- [x] **스마트 리셋**: 초기 전술 복원 기능
- [x] **Progressive UI**: 3단계 팀 설정 플로우
- [x] **다중 저장**: Save/Save As 분리
- [x] **한국어 다크테마**: 전문적 코칭 UI

### 🔄 배포 후 개선 계획 (v1.1.0)
- [ ] **7vs7, 5vs5 지원**: 현재 11vs11만 활성화됨
- [ ] **터치 감도 최적화**: 태블릿 환경 개선
- [ ] **추가 세트피스**: 프리킥, 페널티킥 전용 템플릿
- [ ] **색상 커스터마이징**: 팀 색상 선택 기능

### 🌐 확장 기능
- [ ] **멀티 보드**: 여러 전술판 탭으로 관리
- [ ] **템플릿 라이브러리**: 유명 전술 템플릿 제공
- [ ] **내보내기 옵션**: PDF, JPG, SVG 형식 지원
- [ ] **실시간 협업**: 다중 사용자 동시 편집
- [ ] **클라우드 동기화**: Firebase 기반 데이터 백업
- [ ] **AI 전술 분석**: 포메이션 강약점 분석 및 제안

### 🐛 버그 수정
- [ ] **Android 제스처 이슈**: 일부 디바이스에서 터치 반응성 개선
- [ ] **메모리 누수**: 긴 세션에서 메모리 사용량 증가 현상
- [ ] **SVG 렌더링**: 복잡한 패스에서 렌더링 지연 최적화

### 🧪 실험적 기능
- [ ] **3D 시각화**: 3차원 전술 보드 (React Three Fiber)
- [ ] **AR 모드**: 실제 축구장에 전술 오버레이
- [ ] **음성 명령**: 핸즈프리 전술 편집
- [ ] **비디오 분석 연동**: 실제 경기 영상과 전술 매칭

## 🚀 배포 가이드

### EAS Build 명령어
```bash
# 개발 빌드
npx eas build --profile development

# 프리뷰 빌드 (내부 테스트)
npx eas build --profile preview

# 프로덕션 빌드 (앱스토어)
npx eas build --profile production
```

### 앱스토어 제출
```bash
# iOS App Store
npx eas submit --platform ios

# Google Play Store  
npx eas submit --platform android
```

## 🔮 배포 후 로드맵

### v1.1.0 (배포 후 1개월)
- 7vs7, 5vs5 인원 옵션 활성화
- 터치 감도 최적화 (태블릿 지원)
- 추가 세트피스 템플릿

### v1.2.0 (배포 후 3개월)
- 애니메이션 모드 (플레이 재생)
- 멀티 보드 탭 시스템  
- 성능 프로파일링

### v2.0.0 (배포 후 6개월+)
- 클라우드 동기화 (Firebase)
- 실시간 협업 기능
- AI 전술 분석

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
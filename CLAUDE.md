# 축구 전술 보드 (Tactics Board) 개발 참고사항

> **1\~2일 미니프로젝트용 포트폴리오 앱** — 터치 드로잉(패스 경로), 말(토큰) 드래그, Undo/Redo, PNG Export까지 핵심 전술보드 인터랙션을 담았습니다. Expo + React Native 기반.

![hero-placeholder](./docs/hero.png)

---

## ✨ 핵심 기능 (MVP)

- **전술 보드 1화면**: 전체 코트/하프 코트 토글(선택)
- **말(토큰) 드래그 이동**: 홈/어웨이 11명 + 축구공 배치 및 자유 이동
  - **개선된 터치 시스템**: Reanimated 기반 부드러운 인터랙션
  - **탭-투-셀렉트**: 말 터치로 선택 → 빈 공간 터치로 이동
- **그리기 툴**: 손가락으로 패스/이동 경로 그리기
- **Undo/Redo**: 드로잉 작업 취소/복구
- **Export**: 화면을 **PNG로 캡처 및 공유(Share sheet)**
- **간단 저장/불러오기**: `AsyncStorage` 기반 1개 보드 상태 기억
- **말 커스터마이징**: 더블탭으로 선수 번호/이름 편집

> 포트폴리오에서 어필 포인트: **Canvas/터치 인터랙션**, **상태 관리(Undo/Redo 스택)**, **Export/공유** 경험.

---

## 🧱 기술 스택

- **React Native (Expo, TypeScript)**
- 제스처: `react-native-reanimated` + `react-native-gesture-handler` (부드러운 애니메이션)
- 캡처/공유: `react-native-view-shot`, `expo-sharing`
- 저장: `@react-native-async-storage/async-storage`

> 확장 시 `react-native-svg` 또는 **Skia**로 드로잉 품질을 높일 수 있습니다.

---

## 🚀 실행 방법

```bash
# 1) 프로젝트 생성(예시) & 의존성 설치
npx expo init tactics-board -t expo-template-blank-typescript
cd tactics-board
expo install react-native-gesture-handler react-native-reanimated
expo install react-native-view-shot expo-sharing @react-native-async-storage/async-storage

# 2) 개발 서버 실행
npx expo start
```

- **iOS**: 시뮬레이터 또는 Expo Go 앱으로 실행
- **Android**: 에뮬레이터 또는 Expo Go 앱으로 실행

> 실제 앱 스토어 배포는 범위 외(미니 프로젝트 목표는 데모/포트폴리오)

---

## 📁 프로젝트 구조(예시)

```
.
├── App.tsx                  # 단일 화면 MVP (보드, 드로잉, 드래그, Export)
├── package.json
├── docs/
│   ├── hero.png             # README 상단 썸네일
│   └── demo.gif             # 데모 GIF (선택)
└── README.md
```

> 규모 확장 시 `components/`, `hooks/`, `modules/drawing/` 등으로 분리 권장

---

## 🖊️ 주요 설계/결정

- **의존성 최소화**: 초기엔 SVG/Skia 없이 `View` 조합으로 선 세그먼트 렌더 → 빠른 구현 & 빌드 리스크↓
- **개선된 터치 시스템**: PanResponder → Reanimated로 전환하여 부드러운 애니메이션과 제스처 충돌 해결
- **직관적 선택 시스템**: 탭-투-셀렉트로 드래그 없이도 정확한 말 이동 가능
- **Undo/Redo**: 드로잉 스택 + redo 스택을 분리해 직관적인 동작 보장
- **단일 보관 방식**: 미니 범위에 맞춰 `AsyncStorage` 1개 슬롯만 제공("마지막 전술판")
- **축구공 추가**: 전술 시나리오에 필수적인 볼 위치 표시

---

## 🧪 테스트 체크리스트 (MVP 기준)

- [x] 드로잉 시작/이동/종료가 부드럽다 ✅
- [x] Undo/Redo가 마지막 Stroke 기준으로 정상 동작 ✅
- [x] 탭-투-셀렉트 시스템이 정확하게 동작 (선택 표시 + 이동) ✅
- [x] 축구공과 선수 토큰이 모두 정상 선택/이동됨 ✅
- [x] 더블탭으로 텍스트 편집 모달이 정상 작동 ✅
- [x] ~~PNG Export 결과가 화면과 동일(해상도/배경 포함)하게 저장됨~~ (기능 제거됨) ✅
- [x] 저장/불러오기가 정상 동작 (앱 재시작 후에도 유지) ✅

---

## 📸 데모 캡처 가이드

1. 코치 시나리오: 포메이션 배치 → 패스 경로 2\~3개 드로잉 → Export
2. iOS 시뮬레이터 녹화: `File > New Screen Recording` 또는 QuickTime 이용
3. `docs/demo.gif`로 변환하여 README에 삽입(예: `ffmpeg` → `gif`)

```bash
# mp4 → gif (예시)
ffmpeg -i demo.mp4 -vf "fps=12,scale=540:-1:flags=lanczos" -loop 0 docs/demo.gif
```

---

## 🔗 관련 문서

- **[TODO.md](./TODO.md)**: 전체 개발 로드맵 및 우선순위별 TODO 리스트
- **[TEAM_MANAGEMENT_PLAN.md](./TEAM_MANAGEMENT_PLAN.md)**: v1.1.0 팀 관리 시스템 상세 설계

## 📊 현재 프로젝트 상태

### ✅ v1.0.0 완료 기능들
- 완전한 11vs11 전술 시스템
- 6가지 포메이션 프리셋 (4-3-3, 4-4-2, 3-5-2, 4-2-3-1, 3-4-3, 5-3-2)
- 애니메이션 기반 터치 인터랙션 (SharedValue 드래그)
- SVG 기반 전술 드로잉 시스템
- 통합 Undo/Redo (드로잉 + 플레이어 이동 + 텍스트 편집)
- 선수 커스터마이징 (더블탭 편집)
- 한국어 다크테마 UI
- 완전한 축구장 렌더링 (골포스트, 페널티박스, 센터서클)
- Progressive 팀 설정 UI
- GitHub Pages 지원 페이지 및 개인정보 처리방침

### 🎯 현재 상태
**v1.0.0 iOS 앱스토어 제출 완료** - 심사 대기 중

### 🔮 다음 계획
- **v1.0.1**: Android 출시 (계정 준비 후)
- **v1.1.0**: 팀 관리 시스템 ([상세 계획](./TEAM_MANAGEMENT_PLAN.md))

---


---

## ✅ 완료: 전체 전술 시스템

### 팀 설정 시스템
- **Progressive UI**: 3단계 애니메이션 기반 설정 플로우
- **포메이션 데이터**: 실제 축구 전술 기반 선수 배치 좌표
- **시나리오별 초기화**: 선택한 전술에 따른 선수/볼 위치

### 완전한 축구장 렌더링
- **골포스트**: 상하단 골라인 + 좌우 골포스트
- **페널티박스**: 18야드 박스 + 6야드 골에리어
- **센터서클**: 킥오프 포인트
- **하프라인**: 중앙선

### 애니메이션 기반 드래그 시스템

### 구현된 기능

- **SharedValue 기반 드래그**: 히스토리 오염 없이 부드러운 애니메이션
- **스케일 & 투명도**: 드래그 중 시각적 피드백 (1.1x 스케일, 0.8 투명도)
- **Z-Index 관리**: 드래그 중인 토큰이 다른 토큰 위에 표시
- **성능 최적화**: 매 프레임 상태 업데이트 제거로 60fps 유지

### 핵심 구현

```typescript
// 드래그 시작: 플레이어 찾기 & SharedValue 초기화
const onDragStart = (x: number, y: number) => {
  const nearest = findNearestPlayer(x, y, players);
  if (nearest) {
    dragPlayerId.value = nearest.id;
    isDragging.value = true;
    dragStartPosition.value = { x: nearest.x, y: nearest.y };
    dragOffset.value = { x: 0, y: 0 };
  }
};

// 드래그 중: SharedValue만 업데이트 (히스토리 오염 없음)
.onUpdate((e) => {
  dragOffset.value = { x: e.translationX, y: e.translationY };
})

// 드래그 완료: 최종 위치만 한 번 히스토리에 추가
.onEnd((e) => {
  const finalX = dragStartPosition.value.x + e.translationX;
  const finalY = dragStartPosition.value.y + e.translationY;
  runOnJS(onPlayerMove)(dragPlayerId.value, finalX, finalY);
});
```

### 해결한 문제

- ✅ **히스토리 스택 오염**: 드래그 완료 시에만 히스토리 추가
- ✅ **성능 저하**: React 리렌더링 최소화로 60fps 유지  
- ✅ **Worklet 컨텍스트**: JS와 Worklet 영역 분리로 안정성 확보
- ✅ **포메이션 시스템**: 6가지 실제 축구 전술 구현
- ✅ **TypeScript 안정성**: 모든 컴파일 오류 해결
- ✅ **배포 준비**: EAS Build + 앱 설정 완료

---

## 🧰 코드 스니펫 (핵심 인터랙션 요약)

> 전체 예제는 `App.tsx` 참고. 여기선 개념만 요약합니다.

```ts
// Entity 타입들
export type Point = { x: number; y: number };
export type Stroke = { color: string; width: number; points: Point[] };
export type Player = {
  id: string;
  x: number;
  y: number;
  side: "home" | "away" | "ball";
  label: string;
};

// 개선된 터치 시스템 (Reanimated)
const selectedId = useSharedValue<string | null>(null);
const tap = Gesture.Tap().onStart((event) => {
  const { x, y } = event;
  const nearest = findNearestPlayer(x, y);
  if (nearest) {
    selectedId.value = nearest.id; // 선택
  } else if (selectedId.value) {
    runOnJS(movePlayer)(selectedId.value, x, y); // 이동
    selectedId.value = null;
  }
});

// 더블탭으로 텍스트 편집
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart((event) => {
    const player = findPlayerAt(event.x, event.y);
    if (player) runOnJS(openTextEditor)(player.id);
  });
```

---

## 📦 라이선스

- 개인 포트폴리오/학습 목적으로 자유 사용 가능
- 별도 고지 없는 써드파티 에셋(로고/아이콘) 사용 금지 권장
- 상용 출시/브랜드 사용 시 각 자산의 라이선스 검토 필요

> 필요 시 MIT 라이선스 파일(`LICENSE`) 추가를 권장합니다.

---

## 🙌 크레딧

- 아이디어/기획/개발: 본인
- 참고: 전술보드 일반 UX 패턴, 다양한 코치용 앱 UI 리서치(비상용)

---

## 커밋전 주의사항

- 커밋 전에 빌드 밑 타입, lint 등을 체크해야 합니다.
- Conventional Commits 이 되도록 합니다.

## 클로드 코드 작업 후 알림

- Claude code 의 작업이 20초 이상 걸린 경우 작업 완료후 `say 작업이 완료되었습니다` 를 실행시키도록 합니다.

## 배포 가이드

### EAS 프로젝트 설정 (최초 1회)
```bash
# EAS CLI 설치 및 로그인
npm install -g eas-cli
npx eas login

# EAS 프로젝트 초기화 (대화형)
npx eas project:init
# 또는 수동으로 app.json에 projectId 설정
```

### EAS Build
```bash
# 개발 빌드
npx eas build --profile development

# 프리뷰 빌드 (내부 배포)
npx eas build --profile preview

# 프로덕션 빌드 (앱스토어)
npx eas build --profile production
```

### 앱스토어 제출
```bash
npx eas submit --platform ios
npx eas submit --platform android
```

## 개발 가이드

- **기능 우선 개발**: 각 기능을 완성한 후 즉시 테스트
- **Conventional Commits**: feat/fix/docs 등 일관된 커밋 메시지
- **TypeScript 엄격 모드**: 모든 컴파일 오류 해결 후 커밋
- **성능 우선**: 60fps 유지하는 애니메이션 구현

## 📁 추가 문서

- **DEPLOYMENT.md**: 상세한 EAS Build 및 앱스토어 제출 가이드
- **CHANGELOG.md**: 전체 개발 과정 및 버전별 변경사항
- **package.json**: 모든 의존성 및 스크립트 정의
- **eas.json**: EAS Build 프로필 설정
- **tsconfig.json**: TypeScript 컴파일러 설정

## 🎯 최종 상태 요약

### ✅ 완전히 구현된 기능들
1. **전술 설정 시스템**: 3단계 Progressive UI로 포메이션 선택
2. **6가지 포메이션**: 실제 축구 전술 기반 선수 배치
3. **완전한 축구장**: 골포스트, 페널티박스, 모든 라인 구현
4. **60fps 애니메이션**: SharedValue 드래그로 부드러운 인터랙션
5. **통합 상태 관리**: Undo/Redo + 스마트 리셋
6. **한국어 다크테마**: 전문적 코칭 환경 UI
7. **커스텀 앱 아이콘**: 축구 전술보드 테마
8. **EAS 배포 설정**: 완전한 앱스토어 준비 완료

**현재 빌드 ID**: `a46dfa84-feef-406b-b040-0828f7ca234d`  
**배포 상태**: iOS 프리뷰 빌드 진행중 → 앱스토어 제출 준비 완료

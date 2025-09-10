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

- [ ] 드로잉 시작/이동/종료가 부드럽다
- [ ] Undo/Redo가 마지막 Stroke 기준으로 정상 동작
- [ ] 탭-투-셀렉트 시스템이 정확하게 동작 (선택 표시 + 이동)
- [ ] 축구공과 선수 토큰이 모두 정상 선택/이동됨
- [ ] 더블탭으로 텍스트 편집 모달이 정상 작동
- [ ] PNG Export 결과가 화면과 동일(해상도/배경 포함)하게 저장됨
- [ ] 저장/불러오기가 정상 동작 (앱 재시작 후에도 유지)

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

## 📋 TODO 리스트

### 🎯 개발 우선순위

#### P0 (핵심 기능 완성)
- [x] **SVG 기반 드로잉**: `react-native-svg` Path로 부드러운 선 렌더링 ✅
- [x] **통합 Undo/Redo**: 드로잉 + 플레이어 이동 + 텍스트 편집 ✅
- [x] **더블탭 편집**: 선수 번호/이름 편집 ✅
- [x] **Save/Save As 분리**: 덮어쓰기 vs 새 이름으로 저장 ✅
- [x] **아이콘 기반 UI**: Expo Vector Icons 적용 ✅
- [ ] **전체/하프 코트 토글**: 다양한 전술 시나리오 지원

#### P1 (사용성 개선)
- [ ] **포메이션 프리셋**: 4-3-3, 4-4-2, 3-5-2 등 원클릭 배치
- [ ] **터치 감도 최적화**: 작은 화면에서 정확한 선택
- [ ] **성능 최적화**: 복잡한 드로잉 시 프레임 드롭 방지
- [ ] **색상/테마 시스템**: 팀 색상, 다크/라이트 테마

#### P2 (기능 확장)
- [ ] **세트피스 템플릿**: 코너킥/프리킥/페널티킥 전용 보드
- [ ] **레이어 시스템**: 런/패스/프레싱 등 전술 레이어 분리
- [ ] **애니메이션 모드**: 플레이어 이동 경로 순차 재생
- [ ] **드로잉 도구 확장**: 화살표, 점선, 곡선, 영역 표시
- [ ] **멀티 보드**: 여러 전술판 탭으로 관리

### 🐛 버그 수정 & 최적화

#### 성능 관련
- [ ] **Android 제스처 최적화**: 일부 디바이스 터치 반응성 개선
- [ ] **메모리 관리**: 히스토리 스택 크기 제한, 메모리 누수 방지
- [ ] **SVG 렌더링**: 복잡한 패스 최적화, 배치 렌더링

#### 호환성
- [ ] **크로스 플랫폼 테스트**: iOS/Android 일관성 확보
- [ ] **다양한 화면 크기**: 태블릿, 폴더블 기기 지원
- [ ] **접근성**: 스크린 리더, 고대비 모드 지원

### 🚀 확장 기능 (장기)

#### 협업 & 공유
- [ ] **실시간 협업**: 다중 사용자 동시 편집
- [ ] **클라우드 동기화**: Firebase 기반 데이터 백업
- [ ] **템플릿 공유**: 커뮤니티 전술 템플릿 라이브러리
- [ ] **내보내기 확장**: PDF, SVG, 비디오 형식 지원

#### AI & 분석
- [ ] **AI 전술 분석**: 포메이션 강약점 분석 및 개선 제안
- [ ] **경기 데이터 연동**: 실제 선수 스탯과 포메이션 매칭
- [ ] **자동 포메이션**: 상대팀 분석 기반 최적 전술 제안

#### 실험적 기능
- [ ] **3D 시각화**: React Three Fiber 기반 3차원 전술 보드
- [ ] **AR 모드**: 실제 축구장에 전술 오버레이 (ARKit/ARCore)
- [ ] **VR 지원**: 몰입형 전술 시뮬레이션
- [ ] **음성 명령**: 핸즈프리 전술 편집

## 🔭 로드맵 (개발 일정)

### Phase 1: MVP 완성 (완료 ✅)
- 기본 드로잉 & 플레이어 이동
- Undo/Redo 시스템
- 저장/불러오기
- 아이콘 기반 UI

### Phase 2: 핵심 기능 (1-2개월)
- 전체/하프 코트 토글
- 포메이션 프리셋
- 성능 최적화
- 버그 수정

### Phase 3: 고급 기능 (3-4개월)
- 레이어 시스템
- 애니메이션 모드
- 멀티 보드
- 템플릿 시스템

### Phase 4: 확장 기능 (6개월+)
- 클라우드 동기화
- 실시간 협업
- AI 분석 기능
- 3D/AR 실험

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

## 기타

- TDD 를 지향합니다. 너무 많지는 않게 적절한 테스트 코드가 있으면 좋아요.

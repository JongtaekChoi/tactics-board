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
- UI 관리: `react-native-safe-area-context` (SafeArea 대응)
- 상태 관리: **ContextAPI** (BoardContext로 반응형 크기 관리)
- 저장: `@react-native-async-storage/async-storage`
- 드로잉: `react-native-svg` (벡터 기반 전술 라인)

> **v1.1.0+**: ContextAPI 기반 반응형 디자인으로 모든 디바이스에서 최적화된 사용자 경험 제공

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

- **반응형 디자인 우선**: BoardContext로 SafeArea를 고려한 동적 크기 계산
- **개선된 터치 시스템**: PanResponder → Reanimated로 전환하여 부드러운 애니메이션과 제스처 충돌 해결
- **직관적 선택 시스템**: 탭-투-셀렉트로 드래그 없이도 정확한 말 이동 가능
- **Undo/Redo**: 드로잉 스택 + redo 스택을 분리해 직관적인 동작 보장
- **확장 가능한 아키텍처**: ContextAPI + Hook 패턴으로 미래 기능 확장 대응
- **팀 관리 통합**: v1.1.0에서 실제 팀 데이터와 선수 교체 시스템 구현
- **축구공 추가**: 전술 시나리오에 필수적인 볼 위치 표시

### 🎯 **v1.1.0 핵심 개선사항**

- **BoardContext**: SafeArea 인식 반응형 크기 계산
- **useFormationHelpers**: 재사용 가능한 포메이션 로직
- **실시간 크기 조정**: 화면 회전 및 다양한 디바이스 자동 대응
- **축구장 비율 유지**: 모든 화면에서 1.55 비율 최적화

---

## 🧪 테스트 체크리스트 (v1.1.0 기준)

### 📱 **Core Features**
- [x] 드로잉 시작/이동/종료가 부드럽다 ✅
- [x] Undo/Redo가 마지막 Stroke 기준으로 정상 동작 ✅
- [x] 탭-투-셀렉트 시스템이 정확하게 동작 (선택 표시 + 이동) ✅
- [x] 축구공과 선수 토큰이 모두 정상 선택/이동됨 ✅
- [x] 더블탭으로 텍스트 편집 모달이 정상 작동 ✅
- [x] 저장/불러오기가 정상 동작 (앱 재시작 후에도 유지) ✅

### 🎯 **Responsive Design (v1.1.0)**
- [x] SafeArea insets가 모든 디바이스에서 정확히 계산됨 ✅
- [x] 화면 회전 시 실시간으로 보드 크기가 재조정됨 ✅
- [x] 축구장 비율(1.55)이 모든 화면에서 유지됨 ✅
- [x] 헤더/툴바/ColorPicker 영역을 제외한 최적 공간 활용 ✅
- [x] BoardContext 로딩 상태 관리가 정상 동작 ✅

### 👥 **Team Management (v1.1.0)**
- [x] 팀 생성/편집/삭제가 정상 동작 ✅
- [x] 실제 선수 이름이 전술판에 자동 배치됨 ✅
- [x] 선수 교체 시스템(더블탭 → 교체 선수 선택)이 정상 동작 ✅
- [x] 팀 데이터와 전술판 상태가 정확히 연동됨 ✅

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
**v1.1.0 개발 완료** - 팀 관리 시스템 + 반응형 디자인 ✅

### ✨ **v1.1.0 주요 신기능**
- **🎨 반응형 디자인**: BoardContext 기반 SafeArea 대응
- **👥 팀 관리 시스템**: 실제 팀/선수 데이터 관리
- **🔄 선수 교체**: 더블탭으로 벤치 선수와 교체
- **📱 모든 기기 대응**: iPhone notch, Android navigation bar 자동 처리

### 🔮 단기 계획
- **v1.1.1**: iOS 업데이트 배포 (반응형 디자인 + 팀 관리)
- **v1.2.0**: Android 출시 (플레이스토어 계정 준비 후)

### 🚀 장기 비전: 종합 경기 관리 플랫폼
현재 전술판 앱을 기반으로 **완전한 경기 관리 생태계**로 확장

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
**배포 상태**: iOS 앱스토어 정식 출시 완료 ✅

---

## 🎯 장기 로드맵: 경기 관리 플랫폼으로의 진화

### 💡 비전
> **"단순한 전술판에서 완전한 경기 관리 생태계로"**

현재의 전술판 앱은 향후 종합적인 축구 경기 관리 플랫폼의 **핵심 기반**이 될 수 있습니다.

### 🏗️ 확장 로드맵

#### Phase 1: 기본 경기 관리 (v2.0.0 - 6개월 후)

**핵심 기능:**
```typescript
type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  venue: string;
  status: 'scheduled' | 'live' | 'finished';
  score: { home: number; away: number };
  events: MatchEvent[];  // 골, 교체, 카드 등
};
```

**주요 특징:**
- 경기 일정 관리
- 실시간 스코어 기록
- 기본 경기 이벤트 추적
- 전술판과 경기 기록 연동

#### Phase 2: 실시간 경기 운영 (v2.1.0)

**Live Match Mode:**
- 실시간 경기 진행 상황 기록
- 이벤트 타임라인 (골, 교체, 전술 변경)
- 하프타임 분석 및 전술 조정
- 경기 중 포메이션 변경 기록

**차별화 포인트:**
- 기존 앱들: 단순 스코어 기록
- 우리 앱: **전술 변화와 경기 흐름을 시각적으로 연결**

#### Phase 3: 데이터 분석 & 인사이트 (v2.2.0)

```typescript
type MatchAnalytics = {
  possession: { home: number; away: number };
  passes: { home: number; away: number };
  shots: { home: number; away: number };
  tacticalChanges: TacticalChange[];
  heatmap: PlayerHeatmap[];
  formations: FormationAnalysis[];
};
```

**분석 기능:**
- 포메이션별 성과 분석
- 선수별 경기력 추적
- 상대팀 패턴 분석
- 전술 효과성 측정

#### Phase 4: 시즌 관리 (v3.0.0)

**Season Management:**
- 시즌 달력 및 경기 일정
- 선수 컨디션 관리 (부상, 피로도)
- 팀 성과 대시보드
- 상대 전적 및 전술 히스토리

### 🎯 타겟 사용자 확장

**현재 (v1.x):** 개인 코치, 전술 애호가
**확장 (v2.x+):**
- 아마추어 팀 감독
- 유소년 클럽 코치
- 축구 클럽 운영진
- 축구 분석가
- 리그 관리자

### 💰 수익 모델 가능성

#### Freemium 모델
- **무료 tier**: 기본 전술판 + 단순 경기 기록 (3경기/월)
- **프로 tier**: 무제한 경기, 고급 분석, 클라우드 동기화
- **팀 tier**: 다중 사용자, 팀 협업 기능

#### B2B 확장
- 클럽 라이선스 (전체 조직 관리)
- 리그 관리 시스템
- 코치 교육 플랫폼 연동

### 🔧 기술적 기반의 장점

**현재 구조가 경기 관리로 확장하기 최적인 이유:**

1. **React Native + Expo**: 크로스 플랫폼 확장 용이
2. **Reanimated 애니메이션**: 실시간 데이터 시각화에 최적
3. **상태 관리 시스템**: Undo/Redo → 경기 이벤트 히스토리
4. **팀 관리 기반**: v1.1.0에서 구현될 핵심 인프라
5. **드로잉 시스템**: 경기 분석 시각화로 확장 가능

### 📊 확장 시나리오

#### 시나리오 1: 코치 워크플로우
```
경기 전: 전술판 준비 → 선발 라인업 확정
경기 중: 실시간 전술 조정 → 교체/이벤트 기록
경기 후: 자동 분석 리포트 → 다음 경기 준비
```

#### 시나리오 2: 클럽 관리
```
시즌 계획: 선수 등록 → 리그 일정 등록
경기 운영: 실시간 경기 관리 → 통계 누적
시즌 분석: 성과 대시보드 → 다음 시즌 전략
```

### ⚡ 핵심 차별화 요소

1. **전술 중심 접근**: 단순 기록이 아닌 전술적 관점
2. **시각적 연결성**: 전술판과 경기 데이터의 완벽한 통합
3. **코치 친화적 UX**: 실제 현장 경험을 반영한 워크플로우
4. **확장 가능한 아키텍처**: 개인 → 팀 → 클럽 → 리그 단계적 확장

### 🎪 성공 시나리오 예상

- **v1.x (현재)**: 전술 애호가들의 필수 앱
- **v2.x**: 아마추어 팀의 표준 경기 관리 도구
- **v3.x**: 프로/세미프로 클럽의 종합 관리 플랫폼
- **v4.x+**: 축구 데이터 분석의 새로운 표준

---

## 📋 즉시 실행 가능한 다음 단계

1. **v1.1.0 팀 관리**: 경기 관리의 기반 구축
2. **사용자 피드백 수집**: 실제 코치들의 니즈 파악
3. **MVP 경기 기록**: v2.0.0 프로토타입 개발
4. **파트너십 모색**: 축구 클럽/리그와의 협력 가능성

**결론**: 현재 전술판 앱은 경기 관리 플랫폼으로 발전할 **완벽한 기반**을 보유하고 있습니다.

# 연습 패턴 시퀀스 기능 상세 설계 (v1.2.0)

> **목표**: 코치들이 훈련 패턴을 다중 Phase로 구성하고 애니메이션으로 재생할 수 있는 시스템 구축

---

## 📋 기능 개요

### 핵심 컨셉
실제 축구 훈련에서 사용하는 연습 패턴(Drill Pattern)을 디지털로 구현합니다.
- **패턴**: 특정 훈련 시나리오 (예: "2:1 패스로 수비 따돌리기")
- **Phase**: 패턴 내 각 단계 (Phase 1→2→3)
- **익명 선수**: 실명 대신 번호(1, 2, 3...)로 식별

### 기존 전술판과의 차이점

| 구분 | 기존 전술판 | 연습 패턴 |
|------|-----------|----------|
| **목적** | 경기 전술 계획 | 훈련 패턴 설계 |
| **선수** | 실제 팀 명단 (11명) | 익명 번호 (자유 인원) |
| **구성** | 단일 상태 | 다중 Phase 시퀀스 |
| **재생** | 정적 이미지 | 동적 전환 |
| **저장** | 팀별 전술 | 패턴 라이브러리 |

---

## 🗂️ 데이터 구조

### 타입 정의 (`src/types/drill.ts`)

```typescript
export interface DrillPattern {
  id: string;
  name: string;                    // "2:1 패스로 수비 따돌리기"
  description?: string;            // 상세 설명
  category: DrillCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  phases: DrillPhase[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  tags: string[];                  // 검색용 태그
}

export type DrillCategory =
  | 'passing'      // 패스 연습
  | 'shooting'     // 슈팅 연습
  | 'defending'    // 수비 연습
  | 'setpiece'     // 세트피스
  | 'dribbling'    // 드리블
  | 'custom';      // 사용자 정의

export interface DrillPhase {
  id: string;
  number: number;                  // 1, 2, 3...
  title?: string;                  // "1단계: 초기 패스"
  players: DrillPlayer[];
  ball?: Point;                    // 공 위치
  drawings: Stroke[];              // 패스/이동 경로
  notes?: string;                  // "패스 후 즉시 전방 침투"
  duration?: number;               // 애니메이션 시간 (ms)
}

export interface DrillPlayer {
  id: string;                      // "P1", "P2", "P3"
  label: string;                   // "1", "2", "3"
  x: number;
  y: number;
  role: 'attacker' | 'defender' | 'neutral' | 'goalkeeper';
  color?: string;                  // 커스텀 색상 (옵션)
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  color: string;
  width: number;
  points: Point[];
  type?: 'solid' | 'dashed' | 'arrow'; // v1.3.0에서 확장
}
```

### 저장 구조 (`AsyncStorage`)

```typescript
// 키: DRILL_PATTERNS
{
  patterns: DrillPattern[],
  lastModified: Date,
  dataVersion: 1.0
}

// 키: DRILL_FAVORITES
{
  patternIds: string[]
}
```

---

## 🎨 UI/UX 설계

### 화면 구조

```
App Navigation
├── HomeScreen
│   ├── 전술판 (기존)
│   ├── [NEW] 연습 패턴 🎯
│   └── 팀 관리
│
└── DrillPatternStack (신규)
    ├── DrillPatternListScreen      # 패턴 라이브러리
    ├── DrillPatternEditScreen      # 패턴 편집
    └── DrillPatternViewScreen      # 패턴 재생
```

### 1. 패턴 라이브러리 화면 (`DrillPatternListScreen`)

```
┌───────────────────────────────────┐
│  ⬅ 홈    연습 패턴              🔍│
├───────────────────────────────────┤
│  [전체] [패스] [슈팅] [수비]      │ ← 카테고리 필터
├───────────────────────────────────┤
│  📌 즐겨찾기                      │
│  ┌─────────────────────────────┐ │
│  │ ⭐ 2:1 패스 따돌리기         │ │
│  │ 초급 | 3명 | 3 Phase        │ │
│  └─────────────────────────────┘ │
│                                   │
│  📚 내 패턴 (5)                   │
│  ┌─────────────────────────────┐ │
│  │ 리턴패스 후 침투             │ │
│  │ 중급 | 2명 | 2 Phase        │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ 오버랩 연계 플레이           │ │
│  │ 고급 | 3명 | 4 Phase        │ │
│  └─────────────────────────────┘ │
│                                   │
│  [+ 새 패턴 만들기]               │
└───────────────────────────────────┘
```

**기능:**
- 카테고리별 필터링
- 즐겨찾기/최근 사용 구분
- 검색 (이름/태그)
- 길게 누르기 → 삭제/복제/공유

### 2. 패턴 편집 화면 (`DrillPatternEditScreen`)

```
┌───────────────────────────────────┐
│  ⬅ 취소   2:1 패스 따돌리기   저장│
├───────────────────────────────────┤
│  Phase: [① 초기] [② 패스] [③ 침투] [+] │ ← Phase 탭
├───────────────────────────────────┤
│  🏟️ 축구장                        │
│                                   │
│      [1] ────────→ [2]            │ ← 선수 배치
│                                   │
│            [⚽]                   │ ← 공
│                                   │
│                 🔴[3]             │ ← 수비수 (빨강)
│                                   │
├───────────────────────────────────┤
│  선수 3명 | 카테고리: 패스         │
├───────────────────────────────────┤
│  🔧 도구                          │
│  [👤선수] [⚽공] [✏️그리기] [▶️재생]│
└───────────────────────────────────┘
```

**기능:**
- **Phase 탭**: 탭으로 Phase 전환, + 버튼으로 추가
- **선수 추가**: 👤 버튼 → 역할 선택 (공격/수비/중립) → 터치로 배치
- **공 배치**: ⚽ 버튼 → 터치로 위치 지정
- **드로잉**: ✏️ 버튼 → 패스/이동 경로 그리기
- **재생 미리보기**: ▶️ 버튼 → Phase 시퀀스 확인

**선수 역할별 색상:**
- 🔵 공격수(attacker): 파란색 (#4A90E2)
- 🔴 수비수(defender): 빨간색 (#E74C3C)
- ⚪ 중립(neutral): 흰색 (#ECF0F1)
- 🟡 골키퍼(goalkeeper): 노란색 (#F1C40F)

### 3. 패턴 재생 화면 (`DrillPatternViewScreen`)

```
┌───────────────────────────────────┐
│  ⬅ 뒤로   2:1 패스 따돌리기   편집│
├───────────────────────────────────┤
│  Phase 2/3: 패스 단계              │
├───────────────────────────────────┤
│  🏟️ 축구장                        │
│                                   │
│      [1] ────────→ [2]            │
│                    ↓              │
│            [⚽]                   │
│                                   │
│                 🔴[3]             │
│                                   │
├───────────────────────────────────┤
│  💬 "1번이 2번에게 패스 후        │
│      즉시 전방으로 침투"          │
├───────────────────────────────────┤
│  [◀◀ 이전] [▶️ 재생] [다음 ▶▶]   │
│  속도: [0.5x] [1x] [2x]          │
└───────────────────────────────────┘
```

**기능:**
- Phase 표시기 (현재/전체)
- 노트 표시 (있을 경우)
- 재생 컨트롤:
  - ◀◀ 이전 Phase
  - ▶️/⏸️ 재생/일시정지
  - ▶▶ 다음 Phase
- 속도 조절 (0.5x, 1x, 2x)
- 반복 재생 옵션

---

## 🏗️ 구현 계획

### Phase 1: 기본 구조 (1주차)

#### 1.1. 데이터 레이어
- [ ] `src/types/drill.ts` 타입 정의
- [ ] `src/services/drillService.ts` 생성
  - `createPattern()`
  - `updatePattern()`
  - `deletePattern()`
  - `getPatterns()`
  - `getPatternById()`
- [ ] AsyncStorage 저장/로드 구현

#### 1.2. 네비게이션 설정
- [ ] `DrillPatternStack` 추가
- [ ] HomeScreen에 진입점 추가
- [ ] 3개 화면 스켈레톤 생성

#### 1.3. 기본 컴포넌트
- [ ] `src/components/drill/DrillBoard.tsx`
  - 기존 Pitch 재사용
  - DrillPlayer 렌더링
- [ ] `src/components/drill/DrillPlayer.tsx`
  - 번호 표시 토큰
  - 역할별 색상
- [ ] `src/components/drill/PhaseNavigator.tsx`
  - Phase 탭 UI

### Phase 2: 편집 기능 (1주차)

#### 2.1. 패턴 편집기
- [ ] `DrillPatternEditScreen` 구현
- [ ] 선수 추가/삭제/이동
- [ ] 공 위치 설정
- [ ] 드로잉 통합 (기존 useDrawing 훅 재사용)

#### 2.2. Phase 관리
- [ ] Phase 추가/삭제
- [ ] Phase 간 전환
- [ ] Phase별 독립적 상태 관리

#### 2.3. 저장/불러오기
- [ ] 패턴 저장 폼
- [ ] 카테고리/난이도 선택
- [ ] 이름/설명 입력

### Phase 3: 라이브러리 & 재생 (1주차)

#### 3.1. 패턴 라이브러리
- [ ] `DrillPatternListScreen` 구현
- [ ] 목록 렌더링
- [ ] 카테고리 필터
- [ ] 검색 기능
- [ ] 즐겨찾기 토글

#### 3.2. 기본 재생
- [ ] `DrillPatternViewScreen` 구현
- [ ] Phase 수동 전환 (이전/다음)
- [ ] Phase 정보 표시
- [ ] 노트 표시

#### 3.3. 기본 템플릿
- [ ] 5가지 사전 정의 패턴:
  1. "2:1 패스로 수비 따돌리기" (3명, 3 Phase)
  2. "리턴패스 후 침투" (2명, 2 Phase)
  3. "오버랩 연계" (3명, 4 Phase)
  4. "원터치 패스 연결" (4명, 2 Phase)
  5. "벽패스 활용" (3명, 3 Phase)

---

## 🎬 v1.3.0 확장 계획 (애니메이션)

### 자동 재생 시스템
```typescript
// src/hooks/usePhaseAnimation.ts
const usePhaseAnimation = (pattern: DrillPattern) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x

  const play = () => {
    // Phase 0 → 1 → 2 → ... 자동 전환
    // 선수 위치 애니메이션 (Reanimated)
    // 공 이동 애니메이션
    // 드로잉 순차 표시
  };

  return { currentPhase, isPlaying, speed, play, pause, next, prev };
};
```

### 애니메이션 효과
- **선수 이동**: SharedValue로 부드러운 위치 전환
- **공 이동**: 포물선 궤적 (Bezier curve)
- **드로잉 표시**: 순차적으로 선 그리기 효과
- **Phase 전환**: 페이드 인/아웃

---

## 📊 데이터 예시

### 실제 패턴 JSON

```json
{
  "id": "drill_001",
  "name": "2:1 패스로 수비 따돌리기",
  "description": "2명의 공격수가 1명의 수비수를 패스로 제치는 연습",
  "category": "passing",
  "difficulty": "beginner",
  "tags": ["패스", "수비 돌파", "2vs1"],
  "isFavorite": true,
  "phases": [
    {
      "id": "phase_1",
      "number": 1,
      "title": "초기 위치",
      "players": [
        { "id": "P1", "label": "1", "x": 100, "y": 200, "role": "attacker" },
        { "id": "P2", "label": "2", "x": 300, "y": 200, "role": "attacker" },
        { "id": "P3", "label": "3", "x": 200, "y": 150, "role": "defender" }
      ],
      "ball": { "x": 100, "y": 200 },
      "drawings": [],
      "notes": "1번이 공을 소유한 상태"
    },
    {
      "id": "phase_2",
      "number": 2,
      "title": "첫 번째 패스",
      "players": [
        { "id": "P1", "label": "1", "x": 100, "y": 200, "role": "attacker" },
        { "id": "P2", "label": "2", "x": 300, "y": 200, "role": "attacker" },
        { "id": "P3", "label": "3", "x": 200, "y": 150, "role": "defender" }
      ],
      "ball": { "x": 300, "y": 200 },
      "drawings": [
        {
          "color": "#4A90E2",
          "width": 3,
          "points": [
            { "x": 100, "y": 200 },
            { "x": 300, "y": 200 }
          ]
        }
      ],
      "notes": "1번이 2번에게 패스"
    },
    {
      "id": "phase_3",
      "number": 3,
      "title": "리턴패스 & 침투",
      "players": [
        { "id": "P1", "label": "1", "x": 100, "y": 120, "role": "attacker" },
        { "id": "P2", "label": "2", "x": 300, "y": 200, "role": "attacker" },
        { "id": "P3", "label": "3", "x": 200, "y": 150, "role": "defender" }
      ],
      "ball": { "x": 100, "y": 120 },
      "drawings": [
        {
          "color": "#4A90E2",
          "width": 3,
          "points": [
            { "x": 300, "y": 200 },
            { "x": 100, "y": 120 }
          ]
        },
        {
          "color": "#2ECC71",
          "width": 2,
          "points": [
            { "x": 100, "y": 200 },
            { "x": 100, "y": 120 }
          ]
        }
      ],
      "notes": "2번이 1번에게 리턴패스, 1번은 수비 뒤 공간으로 침투"
    }
  ],
  "createdAt": "2025-09-27T00:00:00Z",
  "updatedAt": "2025-09-27T00:00:00Z"
}
```

---

## 🧪 테스트 체크리스트

### 기능 테스트
- [ ] 패턴 생성/편집/삭제 정상 동작
- [ ] Phase 추가/삭제/순서 변경 정상 동작
- [ ] 선수 배치 및 역할 설정 정확함
- [ ] 드로잉 시스템 통합 정상 동작
- [ ] 저장/불러오기 데이터 무결성
- [ ] 카테고리 필터링 정확함
- [ ] 검색 기능 동작함
- [ ] 즐겨찾기 토글 동작함
- [ ] Phase 수동 전환 부드러움
- [ ] 기본 템플릿 5개 정상 로드

### 성능 테스트
- [ ] 50개 패턴 목록 스크롤 부드러움
- [ ] Phase 전환 시 렉 없음
- [ ] 복잡한 드로잉도 60fps 유지
- [ ] 메모리 누수 없음

### UX 테스트
- [ ] 직관적인 선수 추가 플로우
- [ ] 실수로 Phase 삭제 방지 (확인 다이얼로그)
- [ ] 저장 안 한 변경사항 경고
- [ ] 터치 영역 충분히 큼 (최소 44pt)

---

## 💰 수익 모델 연계

### Freemium 전략
- **무료 tier**: 5개 패턴 저장
- **프로 tier** ($4.99/월):
  - 무제한 패턴 저장
  - 고급 템플릿 15개 추가
  - 패턴 공유 기능 (v1.3.0)
- **팀 tier** ($9.99/월):
  - 팀 공유 라이브러리
  - 협업 편집 (v2.0.0)

### 커뮤니티 마켓플레이스 (v2.0+)
- 코치들이 패턴 업로드/판매
- 인기 패턴 랭킹
- 레벨별 추천 연습

---

## 🔗 관련 문서

- [TODO.md](./TODO.md) - 전체 로드맵
- [CLAUDE.md](./CLAUDE.md) - 프로젝트 개요
- [TEAM_MANAGEMENT_PLAN.md](./TEAM_MANAGEMENT_PLAN.md) - 팀 관리 시스템

---

## 📝 개발 노트

### 기술적 고려사항

1. **상태 관리**:
   - Phase별 독립적 상태 필요
   - Undo/Redo 통합 검토

2. **애니메이션**:
   - Reanimated SharedValue 재사용
   - Phase 전환은 v1.3.0에서 구현

3. **성능**:
   - 패턴 목록 가상화 (FlatList)
   - Phase 렌더링 최적화 (React.memo)

4. **확장성**:
   - v2.0.0에서 경기 관리 시스템과 연동
   - 훈련 계획에 패턴 할당

### UX 개선 아이디어

- 선수 추가 시 자동 번호 부여
- Phase 복사 기능 (같은 위치에서 시작)
- 드래그로 Phase 순서 변경
- Phase 미리보기 썸네일
- 패턴 난이도 자동 제안 (선수 수, Phase 수 기반)

---

**작성일**: 2025-09-27
**버전**: 1.0
**예상 출시**: v1.2.0 (iOS 출시 후 2-3개월)

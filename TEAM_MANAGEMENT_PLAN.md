# 📋 v1.1.0 계획: 팀 관리 시스템

> **목표**: 실제 축구 코치들의 워크플로우에 맞는 팀 관리 시스템 구현

---

## 🎯 목표

실제 축구 코치들의 워크플로우에 맞는 팀 관리 시스템을 구현하여 전술판 작성을 더욱 편리하게 만들기

## 📊 현재 문제점

- 전술판 생성 시마다 선수 이름을 수동으로 입력해야 함
- 교체 시나리오 작성이 번거로움 (이름을 직접 변경해야 함)
- 여러 전술판에서 동일한 팀을 재사용하기 어려움
- 실제 팀 명단 관리 기능 부재
- 상대팀 설정 시에도 팀 데이터를 활용할 수 없음 (홈/어웨이 모두 수동 입력)

---

## 🏗️ 시스템 설계

### 데이터 모델 (확장 가능한 설계)

```typescript
// 선수 데이터 구조 (확장 가능)
type Player = {
  id: string;
  name: string;
  position?: 'GK' | 'DEF' | 'MID' | 'FWD';  // v1.2.0에서 추가 예정
  number?: number;                           // v1.2.0에서 추가 예정
  // 향후 확장 필드들 (v2.0.0+)
  // birthDate?: Date;
  // nationality?: string;
  // stats?: PlayerStats;
};

// 팀 데이터 구조 (확장 가능)
type Team = {
  id: string;
  name: string;           // "FC Seoul", "맨체스터 유나이티드" 등
  players: Player[];      // 확장 가능한 선수 객체 배열
  createdAt: Date;
  updatedAt: Date;
  // 향후 확장을 위한 메타데이터
  metadata?: {
    logo?: string;        // v1.2.0에서 추가 예정
    stadium?: string;     // v2.0.0에서 추가 예정
    manager?: string;     // v2.0.0에서 추가 예정
    [key: string]: any;   // 유연한 확장
  };
};

// AsyncStorage 키 구조
type StorageStructure = {
  'teams': Team[];                    // 모든 팀 목록
  'currentBoard': BoardState;         // 현재 전술판 상태
  'boardHistory': BoardState[];       // 저장된 전술판들
  'dataVersion': number;              // 스키마 버전 관리
};

// 데이터 마이그레이션 지원
const migratePlayerData = (players: string[] | Player[]): Player[] => {
  if (typeof players[0] === 'string') {
    // 레거시 string[] 형태를 Player[] 형태로 변환
    return (players as string[]).map((name, index) => ({
      id: `player-${Date.now()}-${index}`,
      name,
    }));
  }
  return players as Player[];
};
```

### UI/UX 플로우

#### 1. 팀 관리 화면 (새로운 화면)

```
📱 팀 관리
├── 팀 목록
│   ├── "FC Seoul" (23명)
│   ├── "유벤투스" (25명)
│   └── + 새 팀 만들기
├── 팀 생성/편집
│   ├── 팀 이름 입력
│   ├── 선수 목록 (v1.1.0: 이름만, v1.2.0+: 포지션/번호)
│   │   ├── "손흥민" [X]
│   │   ├── "이강인" [X]
│   │   └── + 선수 추가
│   └── [저장] [취소]
```

#### 2. 기존 전술판 설정 플로우 개선

```
현재: 포메이션 선택 → 인원 선택 → 전술판
개선: 홈팀 선택 → 어웨이팀 선택 → 포메이션 선택 → 인원 선택 → 선수 자동 배치 → 전술판

단계별 상세:
1️⃣ 홈팀 선택
   - 기존 팀에서 선택 OR "팀 없이 시작"
   - 선택한 팀의 선수 수 표시

2️⃣ 어웨이팀 선택
   - 기존 팀에서 선택 OR "팀 없이 시작" OR "상대팀 생략"
   - 선택한 팀의 선수 수 표시
   - 상대팀 생략 시 기존처럼 "상대1", "상대2" 등으로 표시

3️⃣ 포메이션 & 인원 선택
   - 기존과 동일하지만 각 팀의 선수 수 고려

4️⃣ 선수 자동 배치
   - 홈팀: 선택한 팀의 Player 객체에서 첫 N명 자동 선택
   - 어웨이팀: 선택한 팀의 Player 객체에서 첫 N명 자동 선택
   - 포지션별 우선순위: v1.2.0부터 GK → DEF → MID → FWD 순서로 자동 배치
   - 팀 없이 시작: 기존처럼 "선수1", "선수2" 등
```

#### 3. 경기 중 교체 시스템

```
현재: 선수 더블탭 → 이름 직접 편집
추가: 선수 더블탭 → 편집 모달
      ├── 직접 편집 (기존)
      ├── 팀에서 교체 (새로운 기능)
      │   └── 벤치 선수 목록 → 선택
      └── [저장] [취소]
```

---

## 🎨 UI 컴포넌트 설계

### 새로 필요한 컴포넌트

```typescript
// 1. 팀 관리 메인 화면
<TeamManagementScreen />
  ├── <TeamList teams={teams} />
  └── <TeamEditor team={selectedTeam} />

// 2. 전술판 설정에 추가
<HomeTeamSelection
  teams={teams}
  onSelectTeam={(team) => void}
  onSkipTeam={() => void}
/>

<AwayTeamSelection
  teams={teams}
  onSelectTeam={(team) => void}
  onSkipTeam={() => void}
  onSkipAwayTeam={() => void}
/>

// 3. 선수 선택/배치 (확장 가능한 구조)
<PlayerSelection
  team={selectedTeam}
  requiredCount={11}
  onPlayersSelected={(players: Player[]) => void}
  showPositions={false}  // v1.1.0에서는 false, v1.2.0부터 true
/>

// 4. 교체 모달 개선
<PlayerEditModal>
  ├── <DirectEdit />      // 기존 기능
  └── <SubstituteFromTeam team={team} />  // 새 기능
</PlayerEditModal>
```

---

## 🔄 데이터 플로우

### 저장/불러오기 로직

```typescript
// 팀 저장 (버전 관리 포함)
const saveTeam = async (team: Team) => {
  const teams = await getTeams();
  const updated = teams.some(t => t.id === team.id)
    ? teams.map(t => t.id === team.id ? team : t)
    : [...teams, team];

  // 데이터 버전과 함께 저장
  await AsyncStorage.setItem('teams', JSON.stringify(updated));
  await AsyncStorage.setItem('dataVersion', '1'); // v1.1.0
};

// 안전한 팀 로딩 (마이그레이션 지원)
const loadTeams = async (): Promise<Team[]> => {
  const stored = await AsyncStorage.getItem('teams');
  if (!stored) return [];

  const teams = JSON.parse(stored);

  // 레거시 데이터 자동 마이그레이션
  return teams.map((team: any) => ({
    ...team,
    players: migratePlayerData(team.players || []),
    metadata: team.metadata || {}
  }));
};

// 전술판에서 팀 연결 (홈/어웨이 모두)
const createBoardWithTeams = (
  homeTeam: Team | null,
  awayTeam: Team | null,
  formation: Formation,
  homeSelectedPlayers: Player[],
  awaySelectedPlayers: Player[]
) => {
  return {
    ...boardState,
    homeTeamId: homeTeam?.id || null,
    awayTeamId: awayTeam?.id || null,
    players: [
      ...mapPlayersToFormation(homeSelectedPlayers, formation, 'home'),
      ...mapPlayersToFormation(awaySelectedPlayers, formation, 'away')
    ]
  };
};
```

---

## 📱 네비게이션 구조 변경

```typescript
// 현재 구조
App.tsx (단일 화면)

// 새로운 구조 (React Navigation 도입)
📱 MainNavigator
├── 🏠 HomeScreen (전술판)
├── 👥 TeamManagementScreen
├── ⚙️ SettingsScreen
└── 📋 SetupScreen (홈팀선택 → 어웨이팀선택 → 포메이션 → 전술판)
```

---

## 🚀 구현 우선순위

### Phase 1: 기본 팀 관리 (1-2일)

- [ ] 확장 가능한 Player/Team 데이터 모델 구현
- [ ] 마이그레이션 지원 함수 구현 (레거시 호환성)
- [ ] 팀 생성/편집 UI 구현 (v1.1.0: 이름만 입력)
- [ ] 팀 목록 화면 구현

### Phase 2: 전술판 연동 (2-3일)

- [ ] React Navigation 도입
- [ ] 전술판 설정 플로우에 홈팀/어웨이팀 선택 추가
- [ ] Player 객체 기반 선수 자동 배치 로직 구현
- [ ] 포지션별 배치 시스템 준비 (v1.2.0 대비)

### Phase 3: 교체 시스템 (1-2일)

- [ ] 교체 모달 개선
- [ ] 벤치 선수 선택 UI
- [ ] 교체 히스토리 통합

### Phase 4: UX 개선 (1일)

- [ ] 애니메이션 및 트랜지션 추가
- [ ] 에러 핸들링 및 예외 상황 처리
- [ ] 성능 최적화

**총 예상 개발 기간:** 6-8일

---

## 🧪 테스트 시나리오

### 팀 관리

- [ ] 팀 생성: 이름 입력 → 선수 추가 → 저장
- [ ] 팀 편집: 기존 팀 수정 → 선수 추가/제거 → 저장
- [ ] 팀 삭제: 팀 삭제 → 연결된 전술판 영향 확인

### 전술판 생성

- [ ] 팀 선택하여 생성: 홈팀/어웨이팀 선택 → 포메이션 → 선수 자동 배치
- [ ] 팀 없이 생성: 기존 방식과 동일하게 작동
- [ ] 상대팀만 생략: 홈팀만 선택하고 어웨이팀은 기본값 사용
- [ ] 인원 부족 시나리오: 팀 선수가 요구 인원보다 적을 때

### 교체 기능

- [ ] 팀 내 교체: 필드 선수 → 벤치 선수로 교체
- [ ] 직접 편집: 기존 방식과 동일
- [ ] 중복 방지: 이미 필드에 있는 선수 선택 시 경고

---

## 💡 추후 확장 계획

### v1.1.1: UI/UX 개선

- 선수 목록 UI 최적화
- 팀 로고 업로드 기능 (metadata.logo 활용)
- 자주 사용하는 선수 우선 정렬

### v1.2.0: 포지션 시스템

- 선수 포지션 정보 활성화 (GK, DEF, MID, FWD)
- 포지션별 자동 배치 시스템
- 선수 번호 관리 시스템
- 팀 템플릿 (유명 팀 프리셋)

### v2.0.0: 경기 관리 연동

- 경기 기록과 팀 데이터 연결
- 선수 통계 및 활용도 추적
- 팀별 전술 히스토리

---

## ⚠️ 주의사항

### 호환성

- 기존 전술판 데이터와 하위 호환성 유지
- 팀 없이 생성한 전술판도 정상 작동

### 성능

- 팀 데이터 로딩 최적화 (큰 팀 목록 처리)
- 메모리 사용량 모니터링

### UX

- 학습 곡선 최소화 (기존 사용자도 쉽게 적응)
- 선택적 기능 (팀 관리를 원하지 않는 사용자 고려)

---

## 📋 구현 체크리스트

### 데이터 레이어 (확장 가능한 설계)

- [ ] 확장 가능한 `Player` 및 `Team` 타입 정의
- [ ] 마이그레이션 지원 함수 구현 (`migratePlayerData`)
- [ ] 버전 관리 시스템 구현 (`dataVersion`)
- [ ] `AsyncStorage` 팀 데이터 관리 함수들 (안전한 로딩/저장)
- [ ] 팀-전술판 연결 로직 (Player 객체 기반)

### UI 컴포넌트

- [ ] `TeamListScreen` - 팀 목록 화면
- [ ] `TeamEditScreen` - 팀 생성/편집 화면 (Player 객체 기반)
- [ ] `PlayerEditModal` - 선수 정보 편집 (v1.1.0: 이름만, 향후 확장)
- [ ] `HomeTeamSelectionModal` - 전술판 생성 시 홈팀 선택
- [ ] `AwayTeamSelectionModal` - 전술판 생성 시 어웨이팀 선택
- [ ] `PlayerSelectionModal` - Player 객체 기반 선수 선택/배치
- [ ] `SubstitutionModal` - 교체 기능 (Player 객체 지원)

### 네비게이션

- [ ] React Navigation 설치 및 설정
- [ ] 화면 간 전환 애니메이션
- [ ] 딥링킹 및 상태 관리

### 통합 테스트

- [ ] 팀 생성 → 전술판 생성 → 교체 전체 플로우 (Player 객체 기반)
- [ ] 레거시 데이터 마이그레이션 테스트 (string[] → Player[])
- [ ] 기존 사용자 하위 호환성 테스트
- [ ] 성능 테스트 (많은 팀/선수 데이터, 객체 처리 성능)

---

---

## 🆚 홈/어웨이 팀 선택 시스템

### 핵심 개선사항

**문제**: 현재는 홈팀만 관리 가능, 상대팀은 항상 수동 입력
**해결**: 홈팀과 어웨이팀 모두 팀 데이터베이스에서 선택 가능

### 사용자 시나리오

#### 시나리오 1: 양팀 모두 관리하는 코치
- 홈팀: "FC Seoul" 선택 → 어웨이팀: "수원 삼성" 선택
- 양팀 모두 실제 선수 명단으로 자동 배치

#### 시나리오 2: 상대팀 분석용
- 홈팀: "우리 팀" 선택 → 어웨이팀: "바르셀로나" 선택
- 상대팀 전술 분석 및 대응 전략 수립

#### 시나리오 3: 기존 사용자 (하위 호환)
- 홈팀: "팀 없이 시작" → 어웨이팀: "상대팀 생략"
- 기존 방식과 동일하게 "선수1", "상대1" 등으로 표시

### 데이터 구조 확장

```typescript
type BoardState = {
  // 기존 필드들...
  homeTeamId: string | null;    // 홈팀 ID
  awayTeamId: string | null;    // 어웨이팀 ID
  players: Player[];            // 홈팀 + 어웨이팀 모든 선수 (확장 가능한 객체)
};

// v1.1.0 → v2.0.0 확장 예시
type ExtendedPlayer = Player & {
  matchStats?: {
    goals: number;
    assists: number;
    appearances: number;
  };
  condition?: 'fit' | 'tired' | 'injured';
};
```

---

---

## 🔄 스키마 확장성 요약

### ✅ 장기 비전을 고려한 설계 결정

1. **Player 객체 기반**: 처음부터 확장 가능한 구조로 시작
2. **선택적 필드**: v1.1.0에서는 `name`만 사용, 향후 점진적 확장
3. **마이그레이션 지원**: 레거시 사용자 데이터 자동 변환
4. **버전 관리**: 스키마 변경 추적 및 안전한 업그레이드

### 🎯 단계별 확장 계획

- **v1.1.0**: `id`, `name` (기본)
- **v1.2.0**: `position`, `number` (포지션 시스템)
- **v2.0.0**: `matchStats`, `condition` (경기 관리)
- **v3.0.0**: 완전한 선수 프로필 시스템

**결론**: 현재 확장 가능한 스키마로 시작하여 미래 경기 관리 플랫폼으로의 자연스러운 확장이 가능합니다.

---

*마지막 업데이트: 2024년 9월 24일*
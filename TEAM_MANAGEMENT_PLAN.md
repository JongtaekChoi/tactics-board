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

---

## 🏗️ 시스템 설계

### 데이터 모델 (단순화)

```typescript
// 팀 데이터 구조
type Team = {
  id: string;
  name: string;           // "FC Seoul", "맨체스터 유나이티드" 등
  players: string[];      // ["손흥민", "이강인", "김민재", ...]
  createdAt: Date;
  updatedAt: Date;
};

// AsyncStorage 키 구조
type StorageStructure = {
  'teams': Team[];                    // 모든 팀 목록
  'currentBoard': BoardState;         // 현재 전술판 상태
  'boardHistory': BoardState[];       // 저장된 전술판들
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
│   ├── 선수 목록
│   │   ├── "손흥민" [X]
│   │   ├── "이강인" [X]
│   │   └── + 선수 추가
│   └── [저장] [취소]
```

#### 2. 기존 전술판 설정 플로우 개선

```
현재: 포메이션 선택 → 인원 선택 → 전술판
개선: 팀 선택 → 포메이션 선택 → 인원 선택 → 선수 자동 배치 → 전술판

단계별 상세:
1️⃣ 팀 선택
   - 기존 팀에서 선택 OR "팀 없이 시작"
   - 선택한 팀의 선수 수 표시

2️⃣ 포메이션 & 인원 선택
   - 기존과 동일하지만 팀 선수 수 고려

3️⃣ 선수 자동 배치
   - 팀을 선택했다면: 첫 N명 자동 선택 또는 사용자가 수동 선택
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
<TeamSelection
  teams={teams}
  onSelectTeam={(team) => void}
  onSkipTeam={() => void}
/>

// 3. 선수 선택/배치
<PlayerSelection
  team={selectedTeam}
  requiredCount={11}
  onPlayersSelected={(players) => void}
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
// 팀 저장
const saveTeam = async (team: Team) => {
  const teams = await getTeams();
  const updated = teams.some(t => t.id === team.id)
    ? teams.map(t => t.id === team.id ? team : t)
    : [...teams, team];
  await AsyncStorage.setItem('teams', JSON.stringify(updated));
};

// 전술판에서 팀 연결
const createBoardWithTeam = (team: Team, formation: Formation, selectedPlayers: string[]) => {
  return {
    ...boardState,
    teamId: team.id,
    players: mapPlayersToFormation(selectedPlayers, formation)
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
└── 📋 SetupScreen (팀선택 → 포메이션 → 전술판)
```

---

## 🚀 구현 우선순위

### Phase 1: 기본 팀 관리 (1-2일)

- [ ] Team 데이터 모델 및 AsyncStorage 연동
- [ ] 팀 생성/편집 UI 구현
- [ ] 팀 목록 화면 구현

### Phase 2: 전술판 연동 (2-3일)

- [ ] React Navigation 도입
- [ ] 전술판 설정 플로우에 팀 선택 추가
- [ ] 선수 자동 배치 로직 구현

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

- [ ] 팀 선택하여 생성: 팀 선택 → 포메이션 → 선수 자동 배치
- [ ] 팀 없이 생성: 기존 방식과 동일하게 작동
- [ ] 인원 부족 시나리오: 팀 선수가 요구 인원보다 적을 때

### 교체 기능

- [ ] 팀 내 교체: 필드 선수 → 벤치 선수로 교체
- [ ] 직접 편집: 기존 방식과 동일
- [ ] 중복 방지: 이미 필드에 있는 선수 선택 시 경고

---

## 💡 추후 확장 계획

### v1.1.1: 세부 개선

- 선수 포지션 정보 추가 (GK, DEF, MID, FWD)
- 자주 사용하는 선수 우선 정렬
- 팀 템플릿 (유명 팀 프리셋)

### v1.2.0: 고급 기능

- 여러 팀 간 경기 시나리오
- 팀별 전술 히스토리
- 선수 통계 및 활용도

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

### 데이터 레이어

- [ ] `Team` 타입 정의
- [ ] `AsyncStorage` 팀 데이터 관리 함수들
- [ ] 팀-전술판 연결 로직
- [ ] 데이터 마이그레이션 (기존 사용자 대응)

### UI 컴포넌트

- [ ] `TeamListScreen` - 팀 목록 화면
- [ ] `TeamEditScreen` - 팀 생성/편집 화면
- [ ] `TeamSelectionModal` - 전술판 생성 시 팀 선택
- [ ] `PlayerSelectionModal` - 선수 선택/배치
- [ ] `SubstitutionModal` - 교체 기능

### 네비게이션

- [ ] React Navigation 설치 및 설정
- [ ] 화면 간 전환 애니메이션
- [ ] 딥링킹 및 상태 관리

### 통합 테스트

- [ ] 팀 생성 → 전술판 생성 → 교체 전체 플로우
- [ ] 기존 사용자 데이터 호환성 테스트
- [ ] 성능 테스트 (많은 팀/선수 데이터)

---

*마지막 업데이트: 2024년 9월 22일*
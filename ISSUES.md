# 🐛 Issues & Feature Requests

## 🚀 Feature Requests

### #001 - 자유 인원수 선택 시스템
**Priority**: Medium  
**Category**: UX Enhancement  
**Status**: Proposed

#### 현재 상황
- 고정된 인원 옵션: 11명, 7명, 5명
- "11 vs 11" 형태로 양팀 대칭 구조
- 포메이션이 11명 위주로 설계됨

#### 제안사항
```
팀 선택 → 자유 인원수 (3-11명) → 전술 유형
```

#### 설계 검토
**UI 옵션들:**
1. **슬라이더 방식**: 3-11명 범위 슬라이더
2. **그리드 버튼**: 3x3 버튼 레이아웃
3. **하이브리드**: 주요 옵션(11,7,5) 큰 버튼 + 나머지 작은 버튼

**기술적 고려사항:**
- 인원별 포메이션 데이터 생성 알고리즘 필요
- 3-5명: 삼각형/다이아몬드 배치
- 6-8명: 2라인 시스템  
- 9-11명: 3라인 시스템

**디자인 통일성:**
- ✅ 현재 Progressive UI와 조화 가능
- ✅ 다크테마 슬라이더 컴포넌트 필요
- ⚠️ 화면 복잡도 증가 가능성

#### 구현 계획
**Phase 1** (v1.1.0):
- 하이브리드 방식: 기존 3개 + 추가 6개 옵션
- 간단한 동적 포메이션 생성

**Phase 2** (v1.2.0):
- 슬라이더 UI로 완전 자유 선택
- 실시간 필드 프리뷰

**Estimated Effort**: 2-3 days  
**Impact**: High (사용자 유연성 크게 향상)

---

### #002 - 포메이션 프리셋 자동 생성
**Priority**: Medium  
**Category**: Algorithm  
**Status**: Dependent on #001

#### 설명
인원수에 따른 자동 포메이션 생성 알고리즘

#### 요구사항
- 3명: 삼각형 배치 (1-1-1)
- 4명: 다이아몬드 배치 (1-2-1)
- 5명: 펜타곤 배치 (1-2-2) 
- 6명: 직사각형 배치 (2-2-2)
- 7명: 전통적 풋살 (1-2-2-2)
- 8명: 확장형 (1-3-3-1)
- 9명: 3라인 기본 (1-3-3-2)
- 10명: 3라인 확장 (1-3-4-2)
- 11명: 기존 포메이션 유지

---

### #003 - 실시간 포메이션 프리뷰
**Priority**: Low  
**Category**: UX Enhancement  
**Status**: Future

#### 설명
인원수 선택 시 실시간으로 필드에 선수 배치 미리보기

---

## 🐛 Known Issues

### #101 - Expo Doctor .expo 디렉토리 경고
**Priority**: Low  
**Category**: Development  
**Status**: Known Issue

#### 설명
- 로컬 `.expo/` 폴더 존재로 expo-doctor 경고 발생
- Git에서는 이미 제외됨
- 개발에 필요하므로 무시 가능

---

## ✅ Completed Issues

### ~~#201 - 다중 Lock 파일 충돌~~ 
**Status**: Resolved in v1.0.0  
- yarn.lock 제거, npm 단일 사용

### ~~#202 - React Native 버전 호환성~~
**Status**: Resolved in v1.0.0  
- 0.79.6 → 0.79.5 다운그레이드

---

**Last Updated**: 2025-09-12  
**Total Issues**: 3 Open, 2 Completed
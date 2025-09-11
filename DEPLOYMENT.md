# 🚀 배포 가이드 (Deployment Guide)

> 축구 전술보드 앱 배포를 위한 완전한 가이드

## 📋 배포 전 체크리스트

### ✅ 완료된 준비사항
- [x] **EAS 프로젝트 초기화**: `a10816a2-efd6-4693-bfd8-fba62ac98602`
- [x] **커스텀 앱 아이콘**: 축구 전술보드 테마 1024x1024px
- [x] **iOS 암호화 설정**: `ITSAppUsesNonExemptEncryption: false`
- [x] **번들 식별자 설정**: `com.tacticsboard.app`
- [x] **TypeScript 컴파일 통과**: 모든 타입 오류 해결
- [x] **한국어 앱 이름**: "축구 전술 보드"
- [x] **다크테마 설정**: `userInterfaceStyle: "dark"`

## 🛠 배포 단계

### 1. EAS CLI 설치 및 로그인
```bash
# EAS CLI 최신 버전 설치
npm install -g eas-cli@latest

# EAS 계정 로그인
npx eas login
```

### 2. 프로젝트 확인
```bash
# 프로젝트 상태 확인
npx eas project:info

# 빌드 설정 확인
npx eas build:configure
```

### 3. 빌드 실행

#### iOS 빌드
```bash
# 프리뷰 빌드 (내부 테스트)
npx eas build --profile preview --platform ios

# 프로덕션 빌드 (App Store 제출용)
npx eas build --profile production --platform ios
```

#### Android 빌드
```bash
# 프리뷰 빌드 (APK)
npx eas build --profile preview --platform android

# 프로덕션 빌드 (Play Store 제출용)
npx eas build --profile production --platform android
```

#### 통합 빌드
```bash
# 모든 플랫폼 동시 빌드
npx eas build --profile production --platform all
```

### 4. 빌드 모니터링
```bash
# 빌드 상태 확인
npx eas build:list

# 특정 빌드 상세 정보
npx eas build:view [BUILD_ID]
```

## 📱 앱스토어 제출

### iOS App Store
```bash
# App Store Connect 제출
npx eas submit --platform ios

# 수동 업로드 시
# 1. 빌드 완료 후 .ipa 파일 다운로드
# 2. Xcode > Window > Organizer에서 업로드
# 3. App Store Connect에서 빌드 확인
```

### Google Play Store
```bash
# Play Console 제출
npx eas submit --platform android

# 수동 업로드 시
# 1. 빌드 완료 후 .aab 파일 다운로드  
# 2. Play Console > 프로덕션에서 업로드
# 3. 출시 노트 작성 및 검토 제출
```

## 📊 현재 빌드 정보

### 최신 빌드
- **빌드 ID**: `a46dfa84-feef-406b-b040-0828f7ca234d`
- **플랫폼**: iOS (preview)
- **상태**: 빌드 대기열
- **로그**: https://expo.dev/accounts/lastchoi/projects/tactics-board/builds/a46dfa84-feef-406b-b040-0828f7ca234d

### 앱 정보
```json
{
  "name": "축구 전술 보드",
  "version": "1.0.0", 
  "bundleIdentifier": "com.tacticsboard.app",
  "projectId": "a10816a2-efd6-4693-bfd8-fba62ac98602"
}
```

## 🔧 문제 해결

### 일반적인 오류

#### 1. 빌드 실패
```bash
# 의존성 확인
npm install

# TypeScript 컴파일 확인
npx tsc --noEmit

# 캐시 클리어
npx expo start --clear
```

#### 2. 인증서 문제 (iOS)
- EAS가 자동으로 인증서 관리
- 필요시 Apple Developer 계정 연결

#### 3. 빌드 대기열 지연
- Free tier는 대기시간 있음
- 유료 플랜으로 우선순위 빌드 가능

### EAS Build 로그 확인
```bash
# 실시간 로그 확인
npx eas build:list --limit 1
npx eas build:view [BUILD_ID] --logs
```

## 📈 배포 후 모니터링

### 버전 관리
```bash
# 버전 업데이트
# app.json의 version 수정 후 재빌드

# 자동 빌드 번호 증가
# eas.json의 autoIncrement: true 설정됨
```

### 업데이트 배포
```bash
# 새 버전 빌드
npx eas build --profile production --platform all

# OTA 업데이트 (JS 번들만)
npx eas update --branch production
```

## 🚀 최종 체크리스트

### App Store 제출 전
- [ ] 앱 아이콘 모든 사이즈 확인
- [ ] 스크린샷 준비 (6.7", 6.5", 5.5", 12.9")
- [ ] 앱 설명 및 키워드 준비
- [ ] 개인정보 처리방침 URL
- [ ] 연령 등급 설정

### Play Store 제출 전  
- [ ] 앱 아이콘 및 Feature Graphic
- [ ] 스크린샷 준비 (휴대폰, 태블릿)
- [ ] 앱 설명 및 단문 설명
- [ ] 컨텐츠 등급 설정
- [ ] 데이터 보안 섹션 작성

---

**🎯 현재 상태: 첫 번째 iOS 프리뷰 빌드 진행 중**
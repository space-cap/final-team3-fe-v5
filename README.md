# Q&A 케어노트

## 소개
- Q&A 케어노트는 매일 제공되는 질문에 답하며 자기 성찰 루틴을 쌓을 수 있도록 돕는 웹 애플리케이션입니다.
- 온보딩 과정에서 관심사, 기분, 알림 채널을 설정하고 첫 답변을 작성하면 오늘의 질문과 히스토리 화면을 이용할 수 있습니다.

## 주요 기능
- 온보딩 3단계 플로우: 관심사 선택, 알림 설정, 첫 답변 작성까지 완료하면 세션이 갱신됩니다.
- 오늘의 질문: 최신 질문과 카테고리를 확인하고, 초안을 Zustand 스토어에 임시 저장합니다.
- 답변 히스토리: 과거 답변을 정리된 리스트와 미리보기 카드로 확인할 수 있습니다.
- 세션 유지: 세션 정보는 `sessionStorage`를 통해 지속되고, 루트 레이아웃에서 안전하게 동기화됩니다.
- Mock API: MSW(Mock Service Worker)를 통해 개발/테스트 환경에서도 일관된 데이터를 제공합니다.

## 기술 스택
- 프런트엔드: React 19, React Router 7, Vite 7, TypeScript
- 상태 관리: TanStack Query 5, Zustand 5
- 스타일: Tailwind CSS, PostCSS
- 테스트: Playwright, Microsoft Edge/Chromium 드라이버
- 품질 도구: ESLint (Flat Config), TypeScript 타입 점검

## 사전 준비
- Node.js 20 LTS 이상 및 npm 10 이상
- Playwright 브라우저 바이너리 설치: `npx playwright install --with-deps`

## 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 (기본 포트 5173)
npm run dev

# 개발 서버를 127.0.0.1:3017에서 실행하고 싶을 때
npm run dev -- --host 127.0.0.1 --port 3017

# 프로덕션 번들 생성
npm run build

# 빌드 결과 미리보기
npm run preview

# 정적 분석 (ESLint)
npm run lint
```

## 테스트
```bash
# Playwright E2E 테스트
npm run test:e2e

# Playwright UI 모드
npm run test:e2e:ui
```
- `npm run test:e2e`는 자동으로 Vite 개발 서버를 `http://127.0.0.1:3017`에서 기동한 뒤 시나리오를 실행합니다.
- 테스트는 MSW 핸들러를 사용하여 고정된 세션/온보딩/질문 데이터를 주입합니다. 실제 API와 통신하려면 브라우저 콘솔에서 `window.__disableMSW = true`로 설정한 뒤 새로고침하면 됩니다.
- 세션 스토어 동기화를 건너뛰어야 하는 시나리오의 경우 `window.__skipSessionSync = true`를 지정하면 루트 레이아웃에서 저장소 업데이트를 하지 않습니다.

## 프로젝트 구조
```
src/
  app/                # 라우팅, 레이아웃, 전역 스토어, API 클라이언트
  features/           # 기능 단위 UI 모듈 (onboarding, daily-question, answer-history 등)
  mocks/              # MSW 워커와 테스트 핸들러
  assets/             # 정적 자산
  main.tsx            # 진입점
tests/
  e2e/                # Playwright 시나리오
public/               # 정적 공개 파일
```

## 개발 가이드
- 새 화면이나 플로우는 `src/features` 아래에 하위 폴더를 만들어 구성하고, 공유 로직은 `src/app` 하위에 배치합니다.
- TanStack Query의 `queryKey`는 `[도메인, 리소스, 세부 식별자]` 형태로 명확하게 정의하고, 서버 응답은 타입을 명시합니다.
- Zustand 전역 스토어는 `sessionStore`와 `questionStore` 두 가지가 있으며, 세션 스토어는 `sessionStorage`를 통해 지속됩니다.
- 온보딩 단계 UI에는 `data-testid`를 유지해 Playwright 시나리오가 안정적으로 동작하도록 합니다.
- ESLint 경고는 CI에서 실패로 간주되므로 로컬에서 `npm run lint`로 확인 후 수정합니다.

## MSW 및 API 전환
- 개발/테스트 중에는 `src/mocks/browser.ts`가 자동으로 MSW를 부트스트랩합니다.
- 실서버 연동이 필요하면 `window.__disableMSW`를 `true`로 지정하거나 엔트리 스크립트에서 해당 플래그를 설정한 뒤 새로고침하세요.
- 테스트 유틸(예: `tests/e2e/onboarding.spec.ts`)은 `window.__skipSessionSync` 플래그로 루트 레이아웃의 세션 동기화를 제어합니다.

## 배포
1. `npm run build`로 프로덕션 번들을 생성합니다.
2. 출력물은 `dist/` 디렉터리에 위치하며, 정적 호스팅(Vercel, Netlify 등)에 업로드하면 됩니다.
3. 배포 전 `npm run preview`로 실제 번들 동작을 확인하는 것을 권장합니다.

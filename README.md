# Q&A 케어 저널

## 소개
Q&A 케어 저널은 매일 한 가지 질문에 답변하며 스스로를 돌아볼 수 있도록 돕는 웹 애플리케이션입니다. 사용자는 온보딩 단계를 통해 관심사와 알림 선호도를 설정하고, 오늘의 질문에 답변하거나 과거 기록을 다시 확인할 수 있습니다.

## 주요 기능
- **온보딩 플로우**: 관심사/기분/알림 채널을 단계별로 입력하고 첫 답변을 작성하면 자동으로 온보딩이 완료됩니다.
- **오늘의 질문**: 매일 새롭게 제공되는 질문을 확인하고 바로 답변 초안을 작성할 수 있습니다.
- **답변 히스토리**: 이전에 남긴 답변들을 한눈에 확인하고, 기록 시각과 미리보기 텍스트를 함께 제공합니다.

## 기술 스택
- **프런트엔드**: React 19, React Router 7, Vite 7, Tailwind CSS
- **상태 관리**: TanStack Query 5, Zustand 5
- **개발 편의**: TypeScript, ESLint, Playwright, MSW(Mock Service Worker)

## 사전 준비 사항
- Node.js 20 LTS 이상 (npm 10 포함)
- Playwright 테스트 실행을 위해 브라우저 바이너리 설치가 필요합니다. `npx playwright install` 명령을 최초 한 번 실행해주세요.

## 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:5173)
npm run dev

# 프로덕션 번들 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트 검사
npm run lint

# 타입 검사
npm run typecheck
```

## 테스트
```bash
# E2E 테스트 (Playwright)
npm run test:e2e

# E2E 테스트 UI 모드
npm run test:e2e:ui
```
- 테스트 실행 시 Vite 개발 서버가 127.0.0.1:3017에서 자동으로 기동됩니다.
- Mock 데이터는 MSW(Mock Service Worker)를 통해 주입되며, 필요 시 브라우저 콘솔에서 `window.__disableMSW = true`를 설정해 실제 API와 동작을 분리할 수 있습니다.

## 프로젝트 구조
```
src/
├─ app/            # 전역 레이아웃, 라우터, 상태 스토어
├─ features/       # 온보딩, 오늘의 질문, 히스토리 등 도메인 모듈
├─ mocks/          # MSW 핸들러 및 테스트용 핸들러
├─ assets/         # 정적 자산
└─ main.tsx        # 엔트리 포인트
```

## 개발 가이드
- 새로운 기능은 `features/` 하위에 도메인 단위로 추가하고, 재사용 가능한 훅/스토어는 `app/`에 배치합니다.
- TanStack Query를 사용할 때는 `queryKey`를 명확히 정의하고, 서버 상태와 클라이언트 상태를 명확히 구분해주세요.
- 온보딩 단계와 같이 복잡한 UI는 Playwright 테스트에 식별 가능한 `data-testid` 속성을 추가해 회귀 테스트를 용이하게 합니다.
- Mock API를 추가하려면 `src/mocks/handlers/`에 핸들러를 정의하고 `handlers/index.ts`에 등록하십시오.

## 배포
1. `npm run build`로 정적 번들을 생성합니다.
2. 출력물은 `dist/` 디렉터리에서 확인할 수 있으며, 정적 호스팅 서비스(Vercel, Netlify 등)에 배포할 수 있습니다.

궁금한 사항이나 개선 아이디어가 있다면 이슈로 공유해주세요!

# 프론트엔드 아키텍처 가이드

## 1. 개요
- 본 문서는 Q&A 케어 저널 웹 애플리케이션의 프론트엔드 구조와 핵심 설계 의사결정을 정리한다.
- 사용자에게 매일 하나의 질문을 제공하고, 사용자가 답변을 작성·저장·회고할 수 있는 경험을 우선한다.
- React + TypeScript + Tailwind CSS 조합을 기본으로 하며, 장기적으로 Supabase 기반 백엔드와 연동한다.

## 2. 기술 스택 요약
| 영역 | 선택 기술 | 적용 범위 | 비고 |
| --- | --- | --- | --- |
| 프레임워크 | React 19 | 컴포넌트 기반 UI, Suspense 활용 | Server Components는 차후 검토 |
| 번들러 | Vite | 개발 서버/HMR, 빌드 최적화 | `vite.config.ts`로 TypeScript 구성 |
| 언어 | TypeScript | 정적 타입, API 응답 모델 정의 | strict 모드 유지 |
| 스타일 | Tailwind CSS | 유틸리티 기반 스타일링 | 디자인 토큰은 `tailwind.config.ts`에 정의 |
| 상태관리 | Zustand | 전역 상태(세션/선택 질문 등) | React Context 최소화 |
| 데이터 패칭 | React Query | Supabase/BFF 연동, 캐싱 | 자동 리트라이·에러 핸들링 사용 |
| 라우팅 | React Router | 메인 화면, 기록 아카이브 등 | SPA 구조 유지 |
| 목킹 | MSW | 초기에는 Mock API로 개발 | BFF/ Supabase 준비 기간 축소 |

## 3. 폴더 구조 제안
```
src/
  app/
    providers/        # QueryClient, Zustand Provider 래퍼
    routes/           # 라우트 정의(일별 질문, 아카이브 등)
    layouts/          # 루트/대시보드 레이아웃 컴포넌트
  features/
    daily-question/   # 질문 표시 및 답변 작성 관련 컴포넌트 + hooks
    answer-history/   # 과거 답변 조회 기능
    question-library/ # 365+ 질문 관리 뷰
    onboarding/       # 초기 온보딩 및 목표 설정
  shared/
    components/       # 공통 UI (버튼, 카드, 모달 등)
    hooks/            # 재사용 훅
    utils/            # 포맷터, Supabase 클라이언트 wrapper
    types/            # DTO/타입 정의
  styles/
    index.css         # Tailwind base import
  mocks/
    handlers.ts       # MSW 핸들러 (질문/답변)
    data/             # 샘플 데이터
```

## 4. 데이터 모델 및 상태 분리
- **Zustand 스토어**
  - `authStore`: 사용자 세션/프로필, Supabase Auth 연동
  - `questionStore`: 현재 질문 ID, 마지막 조회 시각, 로컬 초안 상태
- **React Query 키 전략**
  - `questions.daily` : 오늘의 질문 조회 (매일 1건)
  - `questions.library` : 질문 카탈로그(페이징)
  - `answers.byQuestion` : 특정 질문에 대한 답변 목록
  - `answers.history` : 최근 작성 답변(무한스크롤)
- **Form 상태** : React Hook Form 채택, 컴포넌트 내부 로컬 상태로 관리

## 5. 플로우 & API 연동 전략
1. 앱 진입 시 Supabase 세션 체크 → 없으면 익명 모드/온보딩 라우팅
2. `/today` 라우트 진입 시 `questions.daily` 쿼리로 오늘의 질문을 받아온다.
3. 답변 작성 시 초안을 로컬 스토어에 저장하고, 제출 시 Supabase `answers` 테이블에 upsert.
4. 저장 완료 후 `answers.byQuestion`/`answers.history` 캐시를 갱신한다.
5. 아카이브 화면에서는 카테고리 필터와 날짜 필터를 React Query 파라미터로 전달한다.

## 6. 라우팅 구조
| 경로 | 목적 | 접근 제어 |
| --- | --- | --- |
| `/onboarding` | 사용자 정보, 알림/목표 설정 | 최초 접속 또는 프로필 미완료 시 |
| `/today` | 오늘의 질문 + 답변 입력 | 기본 홈, 로그인 필요 |
| `/history` | 사용자가 작성한 답변 목록 | 로그인 필요 |
| `/questions` | 질문 라이브러리(카테고리/검색) | 운영자/에디터 전용 뷰 옵션 |

- React Router의 `createBrowserRouter` + 코드 스플리팅(Route based lazy) 적용
- 공통 레이아웃에서 헤더(오늘의 진행 상황, 네비게이션)와 풋터 구성

## 7. 스타일 시스템
- Tailwind 기본 프리셋 + 커스텀 토큰(컬러, 폰트, spacing)을 `tailwind.config.ts`에 정의
- 핵심 컴포넌트(Button, Card, Badge 등)는 `shared/components/ui`에 추상화
- 다크모드 고려: CSS class 토글 방식(`class='dark'`), 사용자 설정 상태는 Zustand 관리

## 8. 품질 보증 및 도구
- ESLint + Prettier 설정: `@typescript-eslint` + Tailwind 플러그인 활성화
- Vitest + React Testing Library 도입: 핵심 화면에 대한 렌더링/상호작용 테스트 작성
- Storybook(optional)으로 UI 컴포넌트 문서화, 디자인 팀과 싱크
- CI 시나리오: type check(`tsc --noEmit`), lint, test, build 순으로 실행

## 9. 향후 과제
- Supabase Edge Functions를 통한 AI 프롬프트 백엔드 위임 고려
- 오프라인/자동 저장 기능을 위한 IndexedDB 캐시 레이어 검토
- 접근성(a11y) 점검 체크리스트 수립 및 Lighthouse/axe 자동화 추가

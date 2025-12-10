# 🏠 WooriZip Frontend - 금융 CRM 대시보드

<p align="center">
  <img src="https://img.shields.io/badge/React-19+-blue?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6.0+-purple?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/MUI-7.0+-007FFF?logo=mui&logoColor=white" alt="MUI">
  <img src="https://img.shields.io/badge/TailwindCSS-4.0+-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
</p>

<p align="center">
  React + TypeScript 기반의 금융 CRM 대시보드 애플리케이션으로<br/>
  <strong>AI 기반 재무 계획 및 금융 상품 추천</strong> 서비스를 제공합니다.
</p>

---

## � Screenshots

### 🏠 랜딩 페이지
<!-- 마케팅 랜딩 페이지 스크린샷 -->
<img width="1962" height="1166" alt="Image" src="https://github.com/user-attachments/assets/4b0a5ebf-2212-49bf-84df-ffb879e49761" />

### 🔐 로그인 / 회원가입
<!-- 로그인 페이지 스크린샷 -->
<img width="1968" height="1160" alt="Image" src="https://github.com/user-attachments/assets/83f07d1e-6ee2-4352-adbd-f4e1284973f9" />

### 📊 메인 대시보드
<!-- CRM 대시보드 스크린샷 -->
<img width="2278" height="1420" alt="Image" src="https://github.com/user-attachments/assets/a1aefd56-86fa-4a6f-9bd9-cecfcf608742" />

### 🤖 AI 재무 플래너
<!-- AI 채팅 인터페이스 스크린샷 -->
<img width="2272" height="1414" alt="Image" src="https://github.com/user-attachments/assets/50767e4b-14b4-42ff-ab20-e01b62f671bf" />

### 📝 리포트 화면
<!-- 리포트 뷰어 스크린샷 -->
<img width="2274" height="1420" alt="Image" src="https://github.com/user-attachments/assets/e8fef6be-1a73-4403-806d-d80b3d2922e2" />

---

## �📋 Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration](#%EF%B8%8F-configuration)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Docker Deployment](#-docker-deployment)
- [Pages & Components](#-pages--components)

---

## ✨ Features

### 🎯 주요 기능
- **마케팅 랜딩 페이지** - 서비스 소개 및 가입 유도
- **사용자 인증** - 로그인/회원가입 시스템
- **CRM 대시보드** - 고객 관리 및 분석
- **AI 재무 플래너** - Agent 기반 맞춤형 재무 계획
- **실시간 채팅** - AI 상담 인터페이스
- **리포트 생성** - 재무 분석 리포트

### 🔧 UI/UX
- 📊 **차트 & 그래프** - MUI X Charts, Recharts
- 🌓 **다크/라이트 모드** - 테마 전환 지원
- 📱 **반응형 디자인** - 모바일/태블릿/데스크톱
- ⚡ **빠른 성능** - Vite 기반 최적화된 빌드

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 6 |
| **UI Library** | MUI (Material-UI) 7 |
| **Styling** | TailwindCSS 4, Emotion |
| **Routing** | React Router DOM 7 |
| **HTTP Client** | Axios |
| **Charts** | MUI X Charts, Recharts |
| **Date** | Day.js |
| **Markdown** | React Markdown |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### 30초 시작하기

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/woorizip-frontend.git
cd frontend

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에서 API URL 설정

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

---

## ⚙️ Configuration

### 환경 변수 (.env)

```bash
# Backend API URL (FastAPI 백엔드 서버)
VITE_BACKEND_URL=http://localhost:8000

# Agent API URL (AI Agent 서버)
VITE_AGENT_URL=http://localhost:8080

# Environment
VITE_ENV=development

# App Information
VITE_APP_NAME=WOORI-ZIP
VITE_APP_VERSION=1.0.0
```

### 환경별 설정

| 환경 | VITE_ENV | Backend URL | Agent URL |
|------|----------|-------------|-----------|
| **개발** | `development` | `http://localhost:8000` | `http://localhost:8080` |
| **프로덕션** | `production` | `https://api.woorizip.info` | `https://agent.woorizip.info` |

---

## 📁 Project Structure

```
frontend/
├── public/                     # 정적 파일
│   └── favicon.ico
│
├── src/                        # 소스 코드
│   ├── main.tsx               # 🚀 엔트리포인트
│   ├── App.tsx                # 라우팅 설정
│   ├── index.css              # 글로벌 스타일
│   │
│   ├── auth/                  # 🔐 인증 모듈
│   │   ├── AuthContext.tsx    # 인증 Context
│   │   ├── AuthPage.tsx       # 로그인/가입 페이지
│   │   └── PrivateRoute.tsx   # 보호된 라우트
│   │
│   ├── marketing-page/        # 📢 마케팅 랜딩
│   │   ├── MarketingPage.tsx  # 메인 랜딩 페이지
│   │   └── components/        # 랜딩 컴포넌트
│   │
│   ├── crm/                   # 📊 CRM 대시보드
│   │   ├── CrmDashboard.tsx   # 대시보드 레이아웃
│   │   ├── pages/             # CRM 페이지들
│   │   └── components/        # CRM 컴포넌트
│   │
│   ├── dashboard/             # 📈 대시보드 공통
│   │   ├── Dashboard.tsx      # 대시보드 메인
│   │   ├── components/        # 차트, 위젯 등
│   │   └── theme/             # 대시보드 테마
│   │
│   ├── search/                # 🔍 검색 기능
│   │   └── SearchContext.tsx  # 검색 Context
│   │
│   ├── shared-theme/          # 🎨 공통 테마
│   │   ├── AppTheme.tsx       # 앱 테마 설정
│   │   └── ColorModeSelect.tsx # 다크모드 토글
│   │
│   ├── sign-in/               # 로그인 페이지
│   ├── sign-up/               # 회원가입 페이지
│   ├── checkout/              # 결제 플로우
│   └── blog/                  # 블로그
│
├── screenshots/               # 📸 스크린샷 이미지
├── index.html                 # HTML 템플릿
├── vite.config.ts             # Vite 설정
├── tsconfig.json              # TypeScript 설정
├── package.json               # 의존성 관리
│
├── Dockerfile                 # Docker 빌드
├── docker-compose.yml         # Docker Compose
└── nginx.conf                 # Nginx 설정
```

---

## 🛠 Development

### NPM Scripts

```bash
# 개발 서버 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# ESLint 검사
npm run lint
```

### 코드 스타일

```bash
# Prettier 포맷팅
npx prettier --write src/

# ESLint 자동 수정
npm run lint -- --fix
```

---

## 🐳 Docker Deployment

### 빠른 배포

```bash
# 환경 변수 설정
cp .env.example .env.production

# Docker 이미지 빌드
docker build -t woorizip-frontend:latest .

# 컨테이너 실행
docker run -d \
  --name frontend \
  -p 80:80 \
  woorizip-frontend:latest
```

### Docker Compose

```bash
# 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

---

## 📄 Pages & Components

### 🚪 라우팅 구조

| Path | Component | Description | Auth Required |
|------|-----------|-------------|---------------|
| `/` | `MarketingPage` | 마케팅 랜딩 페이지 | ❌ |
| `/auth` | `AuthPage` | 로그인/회원가입 | ❌ |
| `/dashboard` | `CrmDashboard` | 메인 대시보드 | ✅ |
| `/plan` | `PlanPage` | AI 재무 플래너 | ✅ |
| `/reports` | `ReportsPage` | 리포트 관리 | ✅ |
| `/settings` | `SettingsPage` | 사용자 설정 | ✅ |

### 🧩 주요 컴포넌트

#### Dashboard Components
- `StatCard` - 통계 카드
- `ChartContainer` - 차트 래퍼
- `DataGrid` - 데이터 테이블
- `SideMenu` - 사이드 메뉴
- `Header` - 헤더 네비게이션

#### CRM Components
- `CustomerList` - 고객 목록
- `ChatInterface` - AI 채팅 인터페이스
- `ReportViewer` - 리포트 뷰어
- `ProductRecommendation` - 상품 추천 카드

---

## 🔒 Security

- ✅ 환경 변수로 API URL 관리
- ✅ PrivateRoute로 인증 보호
- ✅ CORS 설정 가이드 제공
- ✅ SSL/HTTPS 설정 가이드 제공

---

<p align="center">
  Made by WooriFisa Team 6
</p>

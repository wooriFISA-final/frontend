# Backend CORS 설정 예제 (FastAPI)
# 이 파일을 Backend 프로젝트의 main.py에 추가하세요

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI(
    title="WooriZip Backend API",
    description="WooriZip Backend API with CORS enabled",
    version="1.0.0",
)

# ============================================
# CORS 설정
# ============================================

# 방법 1: 환경 변수로 관리 (권장)
cors_origins_str = os.getenv(
    "CORS_ORIGINS",
    "https://woorizip.info,https://www.woorizip.info,http://localhost:3000,http://localhost:5173"
)
origins: List[str] = [origin.strip() for origin in cors_origins_str.split(",")]

# 방법 2: 직접 리스트로 관리
# origins = [
#     "https://woorizip.info",
#     "https://www.woorizip.info",
#     "http://localhost:3000",
#     "http://localhost:5173",  # Vite dev server
# ]

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # 허용할 origins
    allow_credentials=True,          # 쿠키/인증 정보 허용
    allow_methods=["*"],             # 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],             # 모든 헤더 허용
    expose_headers=["*"],            # 응답 헤더 노출
    max_age=3600,                    # Preflight 요청 캐시 시간 (초)
)

# ============================================
# 예제 엔드포인트
# ============================================

@app.get("/")
def read_root():
    return {
        "message": "WooriZip Backend API",
        "cors_enabled": True,
        "allowed_origins": origins
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# ============================================
# 실행 방법
# ============================================
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload

#!/bin/bash

# Exit on error
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   WooriZip Frontend 빠른 배포 스크립트${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 환경 변수 확인
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}❌ Error: DOCKER_USERNAME 환경 변수가 설정되지 않았습니다${NC}"
    echo -e "${YELLOW}다음 명령어로 설정하세요:${NC}"
    echo "export DOCKER_USERNAME=your-dockerhub-username"
    exit 1
fi

echo -e "${GREEN}✅ DOCKER_USERNAME: ${DOCKER_USERNAME}${NC}"

# 2. .env.production 파일 확인
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production 파일이 없습니다${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .env.production 파일 발견${NC}"

# 3. 버전 입력 받기
VERSION=${1:-latest}
IMAGE_NAME="${DOCKER_USERNAME}/woorifisa-frontend:${VERSION}"

echo ""
echo -e "${YELLOW}📦 빌드할 이미지: ${IMAGE_NAME}${NC}"
echo ""

# 4. .env 파일 준비
echo -e "${BLUE}[1/5] 환경 변수 파일 준비 중...${NC}"
cp .env.production .env
echo -e "${GREEN}✅ .env 파일 준비 완료${NC}"

# 5. Docker 이미지 빌드
echo ""
echo -e "${BLUE}[2/5] Docker 이미지 빌드 중...${NC}"
docker build -t ${IMAGE_NAME} .

if [ "$VERSION" != "latest" ]; then
    docker tag ${IMAGE_NAME} ${DOCKER_USERNAME}/woorifisa-frontend:latest
fi

echo -e "${GREEN}✅ Docker 이미지 빌드 완료${NC}"

# 6. 로컬 테스트
echo ""
read -p "$(echo -e ${YELLOW}로컬에서 테스트하시겠습니까? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}[3/5] 로컬 테스트 실행 중...${NC}"
    echo -e "${YELLOW}컨테이너 시작 중... (포트 8080)${NC}"
    
    # 기존 테스트 컨테이너 정리
    docker stop woorifisa-frontend-test 2>/dev/null || true
    docker rm woorifisa-frontend-test 2>/dev/null || true
    
    # 테스트 컨테이너 실행
    docker run -d --name woorifisa-frontend-test -p 8080:80 ${IMAGE_NAME}
    
    echo -e "${GREEN}✅ 로컬 테스트 서버 시작됨${NC}"
    echo -e "${YELLOW}브라우저에서 http://localhost:8080 으로 접속하세요${NC}"
    echo ""
    
    read -p "$(echo -e ${YELLOW}테스트가 끝났으면 Enter를 누르세요...${NC})"
    
    # 테스트 컨테이너 정리
    docker stop woorifisa-frontend-test
    docker rm woorifisa-frontend-test
    echo -e "${GREEN}✅ 테스트 컨테이너 정리 완료${NC}"
else
    echo -e "${YELLOW}로컬 테스트 건너뛰기${NC}"
fi

# 7. Docker Hub 푸시
echo ""
read -p "$(echo -e ${YELLOW}Docker Hub에 푸시하시겠습니까? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}[4/5] Docker Hub 로그인...${NC}"
    docker login
    
    echo ""
    echo -e "${BLUE}[5/5] Docker Hub에 푸시 중...${NC}"
    docker push ${IMAGE_NAME}
    
    if [ "$VERSION" != "latest" ]; then
        docker push ${DOCKER_USERNAME}/woorifisa-frontend:latest
    fi
    
    echo -e "${GREEN}✅ Docker Hub 푸시 완료${NC}"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   🎉 배포 준비 완료!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}서버에서 다음 명령어를 실행하세요:${NC}"
    echo ""
    echo -e "${BLUE}# 이미지 다운로드${NC}"
    echo "docker pull ${IMAGE_NAME}"
    echo ""
    echo -e "${BLUE}# 기존 컨테이너 중지 및 제거${NC}"
    echo "docker stop woorifisa-frontend || true"
    echo "docker rm woorifisa-frontend || true"
    echo ""
    echo -e "${BLUE}# 새 컨테이너 실행${NC}"
    echo "docker run -d --name woorifisa-frontend --restart unless-stopped -p 80:80 ${IMAGE_NAME}"
    echo ""
else
    echo -e "${YELLOW}Docker Hub 푸시 건너뛰기${NC}"
    echo -e "${GREEN}빌드만 완료되었습니다${NC}"
fi

echo ""
echo -e "${GREEN}✅ 모든 작업 완료!${NC}"

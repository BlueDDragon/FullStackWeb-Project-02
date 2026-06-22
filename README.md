# 📡 Echo API

> NestJS + Prisma 기반의 텍스트 중심 SNS 백엔드 REST API

---

## 📌 프로젝트 개요

Echo API는 트위터·스레드 형태의 텍스트 중심 SNS 백엔드입니다.  
회원 인증(JWT), 게시글 & 스레드, 팔로우, 북마크, 좋아요 총 5개 도메인을 NestJS + Prisma로 구현한 REST API 서버입니다.  
Swagger(`/docs`)를 통해 API 문서를 자동화하고 이미지 업로드 및 정적 서빙도 지원합니다.

---

## 🗂️ 목차

- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [디렉토리 구조](#-디렉토리-구조)
- [라우터 구성](#-라우터-구성)
- [아키텍처 설명](#-아키텍처-설명)
- [DB 스키마 구조](#-db-스키마-구조)
- [버전 히스토리](#-버전-히스토리)
- [시작하기](#-시작하기)
- [참고 자료](#-참고-자료)

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| **Framework** | NestJS |
| **Language** | TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **인증** | JWT (passport-jwt) + bcrypt |
| **파일 업로드** | Multer (diskStorage) |
| **정적 파일 서빙** | @nestjs/serve-static |
| **API 문서** | Swagger (OpenAPI) |
| **유효성 검사** | class-validator / class-transformer |

---

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| 🔐 **인증** | 회원가입, 로그인(JWT 발급), 로그아웃, 현재 로그인 상태 조회 |
| 👤 **사용자** | 정보 수정, 회원 탈퇴, 프로필·헤더 이미지 업로드 |
| 🤝 **팔로우** | 팔로우·언팔로우, 내 팔로워·팔로잉 목록 조회, 강제 언팔로우 |
| 📝 **게시글** | 작성·수정·삭제, 이미지 첨부(최대 4장), 전체 목록 조회 |
| 🧵 **스레드** | `rootPostId` / `parentPostId` 자기참조 구조로 답글 트리 지원 |
| 📁 **북마크** | 폴더 생성·수정·삭제, 폴더별 게시글 북마크 관리 |
| ❤️ **좋아요** | 게시글 좋아요·취소, 좋아요 목록 조회 |
| 🖼️ **미디어** | 프로필·헤더·게시글 이미지 업로드, 에러 시 자동 롤백 |

---

## 📁 디렉토리 구조

```
echo-api/src/
├── auth/                       # 인증 모듈
│   ├── decorators/             # @CurrentAuth() 파라미터 데코레이터
│   ├── dto/                    # LoginAuthDto, RegisterAuthDto
│   ├── entities/
│   ├── guards/                 # JwtAuthGuard
│   ├── interfaces/             # AuthRequest, JwtPayload
│   ├── strategies/             # JwtStrategy (passport-jwt)
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── bookmarks/                  # 북마크 모듈
│   ├── dto/                    # CreateBookmarkFolderDto, UpdateBookmarkFolderDto
│   ├── entities/
│   ├── bookmarks.controller.ts
│   ├── bookmarks.module.ts
│   └── bookmarks.service.ts
├── common/                     # 공통 유틸리티
│   ├── constants.ts            # JWT, bcrypt, 포트, 업로드 경로 상수
│   ├── upload.config.ts        # Multer 설정 (diskStorage, fileFilter)
│   └── upload.util.ts          # 이미지 URL 생성, 파일 삭제, cleanupOnError
├── likes/                      # 좋아요 모듈
│   ├── dto/
│   ├── entities/
│   ├── likes.controller.ts
│   ├── likes.module.ts
│   └── likes.service.ts
├── pagination/                 # 페이지네이션
│   ├── pagination.ts           # getPagination, getTotalPage 유틸
│   └── query-pagination.dto.ts # page, limit 쿼리 DTO
├── posts/                      # 게시글 모듈
│   ├── dto/                    # CreatePostDto, UpdatePostWithImagesDto
│   ├── entities/
│   ├── post.select.ts          # POST_SELECT, POST_ORDERBY, POST_IMAGE_SELECT 상수
│   ├── posts.controller.ts
│   ├── posts.module.ts
│   └── posts.service.ts
├── prisma/                     # Prisma 모듈
│   ├── prisma.module.ts        # @Global() PrismaModule
│   └── prisma.service.ts       # PrismaClient 래핑
├── users/                      # 사용자 모듈
│   ├── dto/                    # CreateUserDto, UpdateUserDto, UploadImagesDto
│   ├── entities/
│   ├── user.select.ts          # USER_SELECT 상수
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.controller.ts
├── app.module.ts               # ServeStaticModule 포함
├── app.service.ts
└── main.ts                     # Swagger, ValidationPipe, CORS 설정
```

---

## 🔗 라우터 구성

> 🔒 = JWT 인증 필요 (Bearer Token) / 📎 = 파일 업로드 (multipart/form-data)

### Auth `/auth`

| 메서드 | 경로 | 인증 | Param | Body | 설명 |
|--------|------|:----:|-------|------|------|
| `POST` | `/auth/register` | — | — | `RegisterAuthDto` | 회원가입 |
| `POST` | `/auth/login` | — | — | `LoginAuthDto` | 로그인 / JWT 발급 |
| `POST` | `/auth/logout` | 🔒 | — | — | 로그아웃 |
| `GET` | `/auth/me` | 🔒 | — | — | 현재 로그인 상태 조회 |

### Users `/users`

| 메서드 | 경로 | 인증 | Param | Body / Query | 파일 | 설명 |
|--------|------|:----:|-------|--------------|:----:|------|
| `PATCH` | `/users/:id` | 🔒 | `id` | `UpdateUserDto` | — | 사용자 정보 수정 |
| `DELETE` | `/users/:id` | 🔒 | `id` | — | — | 사용자 삭제 |
| `GET` | `/users/:id/posts` | — | `id` | `QueryPaginationDto` | — | 사용자 게시글 목록 |
| `GET` | `/users/:id/media` | — | `id` | `QueryPaginationDto` | — | 사용자 미디어 목록 |
| `GET` | `/users/:id/likes` | — | `id` | `QueryPaginationDto` | — | 사용자 좋아요 목록 |
| `POST` | `/users/me/profile-image` | 🔒 | — | `UploadImagesDto` | 📎 | 프로필 이미지 업로드 |
| `POST` | `/users/me/header-image` | 🔒 | — | `UploadImagesDto` | 📎 | 헤더 이미지 업로드 |
| `POST` | `/users/:followingId/follow` | 🔒 | `followingId` | — | — | 팔로우 |
| `GET` | `/users/:id/followers` | — | `id` | `QueryPaginationDto` | — | 나를 팔로우하는 목록 |
| `GET` | `/users/:id/followings` | — | `id` | `QueryPaginationDto` | — | 내가 팔로우하는 목록 |
| `DELETE` | `/users/:followingId/follow` | 🔒 | `followingId` | — | — | 팔로우 취소 |
| `DELETE` | `/users/:followerId/followers` | 🔒 | `followerId` | — | — | 강제 언팔로우 |

### Posts `/posts`

| 메서드 | 경로 | 인증 | Param | Body / Query | 파일 | 설명 |
|--------|------|:----:|-------|--------------|:----:|------|
| `POST` | `/posts` | 🔒 | — | `CreatePostDto` | 📎 최대 4장 | 게시글 작성 |
| `PATCH` | `/posts/:postId` | 🔒 | `postId` | `UpdatePostWithImagesDto` | 📎 최대 4장 | 게시글 수정 |
| `DELETE` | `/posts/:postId` | 🔒 | `postId` | — | — | 게시글 삭제 |
| `GET` | `/posts` | — | — | `QueryPaginationDto` | — | 전체 게시글 목록 |
| `GET` | `/posts/:postId/thread` | — | `postId` | — | — | 스레드 트리 조회 |
| `GET` | `/posts/:postId/likes` | — | `postId` | `QueryPaginationDto` | — | 게시글 좋아요 목록 |

### Bookmarks `/bookmarks`

| 메서드 | 경로 | 인증 | Param | Body / Query | 설명 |
|--------|------|:----:|-------|--------------|------|
| `POST` | `/bookmarks` | 🔒 | — | `CreateBookmarkFolderDto` | 북마크 폴더 생성 |
| `GET` | `/bookmarks` | 🔒 | — | — | 북마크 폴더 목록 조회 |
| `GET` | `/bookmarks/:folderId` | 🔒 | `folderId` | `QueryPaginationDto` | 폴더 내 북마크 목록 |
| `PATCH` | `/bookmarks/:folderId` | 🔒 | `folderId` | `UpdateBookmarkFolderDto` | 북마크 폴더 수정 |
| `DELETE` | `/bookmarks/:folderId` | 🔒 | `folderId` | — | 북마크 폴더 삭제 |
| `POST` | `/bookmarks/:folderId/posts/:postId` | 🔒 | `folderId`, `postId` | — | 북마크 추가 |
| `GET` | `/bookmarks/:folderId/posts/:postId` | 🔒 | `folderId`, `postId` | — | 북마크 단건 조회 |
| `DELETE` | `/bookmarks/:folderId/posts/:postId` | 🔒 | `folderId`, `postId` | — | 북마크 삭제 |

### Likes `/likes`

| 메서드 | 경로 | 인증 | Param | 설명 |
|--------|------|:----:|-------|------|
| `POST` | `/likes/:postId` | 🔒 | `postId` | 좋아요 |
| `DELETE` | `/likes/:postId` | 🔒 | `postId` | 좋아요 취소 |

---

## 🏗️ 아키텍처 설명

### 레이어 구조

NestJS의 모듈 시스템을 기반으로 도메인별 책임을 분리했습니다.

```
Client
  └── Controller   (요청 파싱, 가드, 인터셉터)
        └── Service    (비즈니스 로직, Ownership 검증, 예외 처리)
              └── PrismaService   (DB 접근)
```

- **Controller**: 라우팅, DTO 바인딩, Guard/Interceptor 적용. 비즈니스 로직 없음.
- **Service**: 권한 검증(`auth.id` 비교), 중복 방지, 파일 처리, 트랜잭션 관리.
- **PrismaService**: `@Global()` 모듈로 전체 등록되어 별도 import 없이 주입 가능.

### JWT 인증 흐름

```
POST /auth/login
  └── AuthService.login()
        ├── UsersService.findByUsername()  → 사용자 조회
        ├── bcrypt.compare()               → 비밀번호 검증
        └── JwtService.sign(payload)       → accessToken 발급

보호된 엔드포인트 요청
  └── JwtAuthGuard (extends AuthGuard('jwt'))
        └── JwtStrategy.validate()         → payload 추출
              └── @CurrentAuth() 데코레이터 → AuthRequest로 컨트롤러에 주입
```

> 로그아웃 시 Redis 블랙리스트 등록 구조를 설계해 두었으며, 실제 Redis 연결은 TODO 상태입니다.

### 모듈 의존성 & 순환 참조 해결

5개 도메인 모듈이 서로를 참조하는 경우 NestJS의 `forwardRef()`로 순환 의존성을 해결했습니다.

```
UsersModule  ←forwardRef→  PostsModule
UsersModule  ←forwardRef→  LikesModule
PostsModule  ←forwardRef→  LikesModule
BookmarksModule  ←forwardRef→  UsersModule
BookmarksModule  ←forwardRef→  PostsModule
```

### 파일 업로드 파이프라인

```
요청 (multipart/form-data)
  └── FilesInterceptor (Multer diskStorage)
        └── cleanupOnError(files, callback)   ← 에러 시 업로드 파일 자동 삭제
              └── Service (DB 저장, URL 생성)  ← $transaction으로 원자적 처리
                    └── ServeStaticModule      ← uploads/ 정적 서빙
```

- 이미지 파일은 `uploads/user/profile`, `uploads/user/header`, `uploads/post` 경로에 분리 저장됩니다.
- 파일명은 `crypto.randomUUID()`로 생성하여 충돌을 방지합니다.
- DB 저장은 Prisma `$transaction` 안에서 처리되어, 이미지 레코드 생성·삭제와 게시글 업데이트가 원자적으로 실행됩니다. 트랜잭션 중 어느 단계에서든 실패하면 전체 DB 변경이 롤백되고 에러를 반환합니다.
- 서비스 로직에서 예외 발생 시 `cleanupOnError`가 디스크에 저장된 파일을 자동으로 제거합니다.

### 공통 패턴

| 패턴 | 설명 |
|------|------|
| `exists*()` | 중복 여부 확인 후 `ConflictException` throw. `existsLike`, `existsBookmark`, `existsUsername`, `existsEmail`, `existsFollow` |
| `find*()` | 단건 조회 후 없으면 `NotFoundException` throw. 내부 유틸로 사용 |
| `POST_SELECT` / `USER_SELECT` | Prisma select 필드를 상수로 추출. password 필드 노출 방지 및 일관된 응답 형태 보장 |
| `getPagination` / `getTotalPage` | 페이지네이션 skip·take 계산 유틸. 모든 목록 API에서 공통 사용 |
| `Promise.all` | 목록 데이터와 `count` 쿼리를 병렬 실행해 응답 지연 최소화 |

---

## 🗄️ DB 스키마 구조

### 엔티티 목록

| 모델 | 테이블 역할 | 주요 필드 |
|------|------------|-----------|
| `User` | 사용자 계정 | `id (uuid)`, `username`, `email`, `password`, `displayName`, `profileImgUrl`, `headerImgUrl` |
| `Post` | 게시글 & 스레드 노드 | `id (int, auto)`, `authorId`, `content`, `state (enum)`, `rootPostId`, `parentPostId` |
| `PostImage` | 게시글 첨부 이미지 | `id (uuid)`, `postId`, `imgUrl` |
| `PostLike` | 게시글 좋아요 (M:N 조인) | `userId`, `postId` — 복합 PK `likeId` |
| `BookmarkFolder` | 북마크 폴더 | `id (uuid)`, `userId`, `name`, `description` |
| `Bookmark` | 북마크 항목 (M:N 조인) | `folderId`, `postId` — 복합 PK `bookmarkId` |
| `Follow` | 팔로우 관계 (M:N 조인) | `followerId`, `followingId` — 복합 PK `followId` |

### 관계 구조

```
User ──< Post (1:N, authorId)
User ──< PostLike (1:N)
User ──< BookmarkFolder (1:N)
User ──< Follow (1:N, follower / following 양방향)

Post ──< Post (자기참조: rootPostId, parentPostId)
Post ──< PostImage (1:N)
Post ──< PostLike (1:N)
Post ──< Bookmark (1:N)

BookmarkFolder ──< Bookmark (1:N)
```

### Post 자기참조 (스레드 구조)

| 필드 | 설명 |
|------|------|
| `rootPostId` | 스레드의 최상위 게시글 ID. 최초 게시글은 생성 후 자신의 id로 업데이트 |
| `parentPostId` | 직접 답글 대상 게시글 ID. 루트 게시글은 null |

```
[Post A] rootPostId=A, parentPostId=null   ← 스레드 루트
  └── [Post B] rootPostId=A, parentPostId=A
        └── [Post C] rootPostId=A, parentPostId=B
```

### PostState 열거형

| 값 | 설명 |
|----|------|
| `PUBLIC` | 전체 공개 |
| `PRIVATE` | 비공개 |
| `NOTICE` | 공지 |
| `DELETED` | 삭제됨 (소프트 삭제용) |

---

## 📝 버전 히스토리

| 버전 | 주요 변경 사항 |
|------|---------------|
| `v1.0.0` | 최초 릴리즈 — Auth, Users, Posts, Bookmarks, Likes 5개 도메인 구현 |

---

## 🚀 시작하기

```bash
# 패키지 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
cp .env.example .env

# Prisma 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run start:dev
```

브라우저에서 [http://localhost:{PORT}/docs](http://localhost:3000/docs)로 Swagger 문서에 접속합니다.

### 환경 변수

```env
PORT=3000
CLIENT_PORT=3001

BCRYPT_ROUND=10

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

DATABASE_URL=postgresql://user:password@localhost:5432/echo
```

---

## 📚 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [passport-jwt 문서](https://www.passportjs.org/packages/passport-jwt/)
- [Swagger / OpenAPI (NestJS)](https://docs.nestjs.com/openapi/introduction)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)

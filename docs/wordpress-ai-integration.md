# WordPress AI Integration (워드프레스 AI 연동 설계서)

> 사장님, 여기에 이전에 말씀하셨던 **워드프레스 연동 관련 아주 긴 기획서/설계서 원문**을 그대로 복사해서 붙여넣기(Paste) 해주세요!
> 제가 작업할 때마다 이 파일을 열어서 지시사항을 꼼꼼히 확인하고 그대로 실행하겠습니다.

## 1. 개요
(여기에 내용 붙여넣기)

## 2. 작업 상세
# 마젠타랩 WordPress ↔ ChatGPT 연결 시스템 구축 프롬프트 — 기존 구조 우선 재사용 + 단계별 안전 구현

## 프로젝트 배경

현재 이 프로젝트는 **마젠타랩 블로그의 실제 운영 코드베이스**입니다.

마젠타랩은 WordPress를 콘텐츠 관리 백엔드(CMS)로 사용하고 있으며, 별도의 프론트엔드 블로그가 WordPress의 게시글 데이터를 불러와 사용자에게 보여주는 구조입니다.

따라서 **WordPress와 프론트엔드 간 연결은 이미 존재합니다.**

이번 작업의 목적은 새로운 WordPress 시스템을 처음부터 다시 만드는 것이 아닙니다.

기존 프로젝트 안에 이미 구현되어 있는:

* WordPress REST API 연결
* 게시글 조회 로직
* 카테고리/태그 조회
* 이미지 처리
* 캐시 처리
* 프론트엔드 데이터 변환
* SEO metadata 처리
* 다국어 처리
* API Route
* 서버 환경변수
* 인증 방식

등을 **먼저 철저하게 조사한 후 최대한 재사용**하여, 향후 ChatGPT가 마젠타랩의 콘텐츠를 안전하게 읽고 분석하고 수정할 수 있는 구조를 추가하는 것이 목적입니다.

---

# 0. 가장 중요한 작업 원칙

## 절대로 바로 새 시스템부터 만들지 마세요.

**먼저 현재 코드베이스를 조사하세요.**

이번 작업의 최우선 원칙은 다음입니다.

```text
DISCOVER EXISTING SYSTEM
↓
UNDERSTAND EXISTING SYSTEM
↓
REUSE EXISTING CODE
↓
EXTEND ONLY WHAT IS MISSING
```

즉,

```text
새 WordPress client를 무조건 만들기
새 API 구조를 무조건 만들기
기존 코드와 중복되는 fetch 함수를 다시 만들기
새 CMS 구조 만들기
```

를 하지 마세요.

기존 코드가 있다면 그것을 우선 사용합니다.

---

# 1. 작업 시작 전 반드시 프로젝트 전체를 조사하세요

코드를 수정하기 전에 현재 프로젝트에서 WordPress 관련 구현을 전부 탐색해주세요.

다음 키워드를 포함하여 검색합니다.

```text
wordpress
wp-json
wp/v2
posts
media
categories
tags
slug
content_id
meta
acf
yoast
rankmath
aioseo
fetch
axios
revalidate
ISR
cache
next/cache
unstable_cache
generateStaticParams
generateMetadata
sitemap
locale
language
translations
```

그리고 다음 디렉터리도 확인합니다.

```text
/app
/pages
/api
/lib
/utils
/services
/server
/types
/components
/hooks
/scripts
```

또한 `.env.example`, 환경변수 사용 코드, API Route도 조사합니다.

---

# 2. 기존 WordPress 연결 구조를 먼저 문서화하세요

코드 수정 전에 다음 항목을 찾아 요약해주세요.

## WordPress 연결

* WordPress Base URL은 어디에 정의되어 있는가?
* REST API는 어떤 Endpoint를 사용하는가?
* 게시글은 어떤 함수에서 가져오는가?
* pagination은 어떻게 처리되는가?
* WordPress 인증이 이미 존재하는가?
* Application Password를 사용하고 있는가?
* Public REST API만 사용하고 있는가?

## 데이터 구조

현재 게시글에서 다음 값들이 어떻게 처리되는지 확인합니다.

```text
wordpress_id
content_id
language
slug
title
content
excerpt
category
tags
meta_description
featured_image
published_at
updated_at
```

## 다국어

현재 KO / EN / JA 구분이 어떻게 이루어지는지 조사합니다.

예:

```text
custom field
category
slug suffix
Polylang
WPML
ACF
custom API
```

추측하지 말고 실제 코드와 WordPress 응답 구조에서 확인합니다.

---

# 3. 현재 프론트엔드 데이터 흐름을 파악하세요

현재 구조를 다음과 같이 실제 코드 기준으로 설명해주세요.

예:

```text
WordPress
↓
REST API
↓
XXXX 함수
↓
데이터 변환
↓
Next.js Server Component / API
↓
Cache
↓
SeoArticle.tsx
↓
사용자 페이지
```

실제 코드에서 확인한 파일명과 함수를 사용합니다.

---

# 4. 기존 코드 재사용이 최우선입니다

예를 들어 이미 다음과 같은 함수가 있다면:

```ts
getPosts()
getPostBySlug()
fetchWordPressPosts()
getCategories()
```

동일 기능을 하는 새로운 함수를 만들지 않습니다.

필요하면 기존 함수를 확장합니다.

예:

```ts
getPosts()
```

↓

```ts
getPosts({
  page,
  perPage,
  language,
  category,
  status
})
```

처럼 확장합니다.

---

# 5. 기존 WordPress 타입도 재사용하세요

이미 다음과 같은 TypeScript type/interface가 존재한다면:

```ts
WordPressPost
WPPost
Post
Article
```

중복 타입을 새로 만들지 않습니다.

필요한 필드만 확장해주세요.

---

# 6. 캐시 시스템을 절대 깨뜨리지 마세요

현재 마젠타랩 프론트엔드는 WordPress 데이터와 캐시 시스템이 연결되어 있습니다.

현재 구현되어 있는:

```text
Next.js cache
ISR
revalidate
CDN
custom revalidate API
```

등을 먼저 조사합니다.

기존 캐시 전략을 함부로 변경하지 않습니다.

특히 WordPress 수정 이후 프론트엔드에서 최신 콘텐츠가 어떻게 반영되는지 현재 구조부터 파악합니다.

---

# 7. 중요: 코드에 노출된 Secret 확인

현재 프로젝트 안에서 다음과 같이 Secret이 코드 또는 문서에 직접 적혀 있는지 검사합니다.

```text
/api/revalidate?secret=...
```

실제 Secret 값이 코드, Markdown, README 등에 평문으로 저장되어 있다면 보안 위험으로 보고합니다.

단, **임의로 즉시 변경하거나 삭제하지 마세요.**

먼저 어디에서 사용되는지 확인하고 안전한 migration 계획을 세웁니다.

최종적으로는:

```env
REVALIDATE_SECRET=...
```

형태의 환경변수 사용을 권장합니다.

---

# 8. 기존 시스템을 파악한 뒤 Gap Analysis를 수행하세요

다음 표 형태로 정리해주세요.

| 기능                 | 기존 구현 | 재사용 가능 | 추가 개발 필요 |
| ------------------ | ----- | ------ | -------- |
| 글 목록 조회            |       |        |          |
| 글 상세 조회            |       |        |          |
| WordPress 인증       |       |        |          |
| 이미지 조회             |       |        |          |
| 이미지 업로드            |       |        |          |
| 글 수정               |       |        |          |
| SEO meta 수정        |       |        |          |
| 다국어                |       |        |          |
| cache revalidation |       |        |          |
| revision           |       |        |          |
| rollback           |       |        |          |
| AI audit metadata  |       |        |          |

**이 분석이 끝나기 전에는 대규모 코드를 작성하지 마세요.**

---

# 9. 이번 프로젝트의 최종 목표

장기적으로 ChatGPT가 WordPress 콘텐츠를 직접 읽고 분석하고 수정할 수 있도록 합니다.

최종 구조는 개념적으로:

```text
ChatGPT
↓
Magentalab AI Content Interface
↓
기존 WordPress 연결 코드
↓
WordPress REST API
↓
WordPress
↓
기존 Magentalab Frontend
```

입니다.

중요한 점은:

```text
ChatGPT
↓
새 WordPress 시스템
```

을 만드는 것이 아니라,

```text
ChatGPT
↓
기존 마젠타랩 WordPress 시스템의 안전한 확장
```

입니다.

---

# 10. MCP는 지금 만들지 않습니다

매우 중요합니다.

**현재 단계에서는 MCP Server를 구현하지 마세요.**

MCP는 최종 단계에서 추가합니다.

우선순위는 다음입니다.

```text
Phase 0
기존 시스템 분석

↓

Phase 1
READ ONLY

↓

Phase 2
Revision / Preview

↓

Phase 3
Media

↓

Phase 4
Controlled Update

↓

Phase 5
MCP
```

Phase 1이 정상 작동하는 것이 확인되기 전에는 Phase 2 이상으로 넘어가지 않습니다.

---

# 11. Phase 3.5 — Evidence Pipeline (Dynamic Data Injection)

최근 업데이트된 마젠타랩 고도화 원칙에 따라, `[근거]` 텍스트는 기존 텍스트 형태 그대로 워드프레스 본문(HTML)에 렌더링하지 않습니다.
대신 프론트엔드 React 컴포넌트(`VeterinaryReferencesSection`)에서 아름다운 UI 카드로 렌더링될 수 있도록 동적 데이터 주입 파이프라인을 구축합니다.

### A. 동적 데이터 주입 원칙
1. AI는 생성된 `[근거]`, `근거 해설`, `안전 주의사항`, `레퍼런스 링크`를 JSON 객체로 파싱합니다.
2. 이 JSON 데이터를 `<script type="application/json" id="custom-vet-references">` 형태의 투명한 HTML 블록으로 변환합니다.
3. 워드프레스 포스트 본문의 가장 하단에 이 `<script>` 블록만 Append 합니다. (기존 본문 HTML 및 이미지는 절대 건드리지 않습니다.)

### B. 프론트엔드 렌더링
- Next.js의 `app/posts/[id]/page.tsx` 등 페이지 단에서 `post.content.rendered`에 포함된 이 `<script>` 태그를 감지합니다.
- 추출된 JSON 데이터를 파싱하여 `VeterinaryReferencesSection` 컴포넌트의 `customEvidence` prop으로 넘깁니다.
- 프론트엔드 코드를 하드코딩하지 않아도 워드프레스 포스트마다 1:1로 매칭되는 고유의 수의학 근거를 출력합니다.

### C. 안전장치 (Fail-Safe)
- Evidence 저장이 실패할 경우 해당 Revision의 Apply 작업을 즉각 중단합니다.
- 이는 454개의 모든 포스트가 누락 없이 정확한 수의학 근거 카드를 갖추도록 하기 위함입니다.

---

# 12. Phase 0 — Existing System Discovery

가장 먼저 수행할 작업입니다.

다음 결과를 사용자에게 보고합니다.

### A. WordPress 관련 파일

예:

```text
/lib/wordpress.ts
/app/api/...
/services/...
```

### B. 사용 중인 함수

예:

```text
getPosts
getPostBySlug
...
```

### C. WordPress REST Endpoint

### D. 인증 여부

### E. 데이터 모델

### F. 캐시 구조

### G. 다국어 구조

### H. 이미지 처리 구조

### I. SEO 구조

### J. 재사용 가능한 코드

### K. 새로 필요한 기능

---

# 12. Phase 1 목표 — READ ONLY

Phase 1에서는 WordPress에 어떤 데이터도 수정하지 않습니다.

```text
WRITE = FALSE
DELETE = FALSE
PUBLISH = FALSE
SLUG CHANGE = FALSE
MEDIA UPLOAD = FALSE
```

오직 읽기만 구현합니다.

---

# 13. Phase 1에서 필요한 기능

ChatGPT 또는 향후 AI 시스템이 다음 데이터를 읽을 수 있도록 합니다.

```text
게시글 목록
게시글 상세
content_id
language
slug
title
content
excerpt
categories
tags
meta description
featured image
본문 이미지
published_at
modified_at
```

---

# 14. 전체 게시글 조회

가능하면 기존 WordPress 게시글 조회 함수를 확장합니다.

목표 인터페이스 예:

```text
GET /api/ai-content/posts
```

지원:

```text
page
per_page
language
category
status
search
modified_after
modified_before
content_id
slug
```

단, 기존 프로젝트의 API naming convention이 존재하면 **그 규칙을 따릅니다.**

무조건 `/api/ai-content/posts`를 새로 만들 필요는 없습니다.

---

# 15. 목록 응답

목록 요청 시 454개 글의 전체 HTML을 한 번에 반환하지 않습니다.

예:

```json
{
  "total": 454,
  "page": 1,
  "per_page": 50,
  "posts": [
    {
      "wordpress_id": 123,
      "content_id": "DOG-001",
      "language": "ko",
      "slug": "dog-skin-disease-symptoms-treatment",
      "title": "...",
      "status": "publish",
      "categories": ["건강/질병"],
      "published_at": "...",
      "modified_at": "...",
      "featured_media_id": 551
    }
  ]
}
```

---

# 16. 게시글 상세 조회

목표:

```text
GET /api/ai-content/posts/{id}
```

또는 기존 API 구조에 맞게 구현합니다.

응답 예:

```json
{
  "wordpress_id": 123,
  "content_id": "DOG-001",
  "language": "ko",
  "slug": "dog-skin-disease-symptoms-treatment",
  "title": "...",
  "content_raw": "...",
  "content_rendered": "...",
  "excerpt": "...",
  "meta_description": "...",
  "categories": [],
  "tags": [],
  "status": "publish",
  "url": "...",
  "featured_image": {
    "id": 551,
    "url": "...",
    "alt": "..."
  },
  "images": [],
  "published_at": "...",
  "modified_at": "..."
}
```

---

# 17. content_id는 반드시 유지합니다

기존 마젠타랩 콘텐츠에는 `content_id`가 존재합니다.

먼저 실제 WordPress에서 이 값이 어디에 저장되어 있는지 확인합니다.

예:

```text
ACF
Custom Field
REST field
database metadata
```

새 필드를 임의로 만들기 전에 기존 구조를 찾으세요.

기존 구조가 있다면 그대로 사용합니다.

`content_id`를 자동 변경하지 않습니다.

---

# 18. language 구조도 기존 것을 사용합니다

마젠타랩은:

```text
ko
en
ja
```

콘텐츠를 운영합니다.

현재 language가 어디에 저장되어 있는지 먼저 확인합니다.

기존 값이 있다면 그대로 사용합니다.

새 custom field를 중복으로 만들지 않습니다.

---

# 19. 번역 콘텐츠 연결 관계 조사

동일 주제의:

```text
KO
EN
JA
```

콘텐츠가 어떻게 연결되는지 조사합니다.

가능하면 향후 다음과 같이 조회 가능하게 합니다.

```json
{
  "content_group_id": "DOG-001",
  "translations": {
    "ko": 123,
    "en": 456,
    "ja": 789
  }
}
```

단, 현재 데이터 구조에 존재하지 않는 관계를 억지로 생성하지 않습니다.

---

# 20. SEO Plugin 먼저 조사

다음 중 어떤 SEO 시스템을 사용하는지 실제 프로젝트와 WordPress에서 확인합니다.

```text
Yoast SEO
Rank Math
All in One SEO
Custom SEO
Frontend-generated SEO
```

마젠타랩은 별도의 프론트엔드를 사용하므로 WordPress SEO Plugin 값이 실제 프론트엔드 SEO에 사용되지 않을 수도 있습니다.

따라서 반드시:

```text
WordPress metadata
↓
Frontend generateMetadata
↓
실제 HTML <title>
↓
meta description
↓
canonical
```

흐름을 확인합니다.

---

# 21. 콘텐츠 분석용 Lightweight Endpoint

454개 전체를 효율적으로 분석할 수 있도록 기존 데이터를 활용해 가벼운 audit 데이터를 제공할 수 있게 설계합니다.

예:

```json
{
  "wordpress_id": 123,
  "content_id": "DOG-001",
  "language": "ko",
  "slug": "...",
  "title": "...",
  "character_count": 4200,
  "word_count": 1900,
  "image_count": 3,
  "heading_count": {
    "h1": 0,
    "h2": 6,
    "h3": 4
  },
  "internal_link_count": 4,
  "external_link_count": 6,
  "table_count": 2,
  "meta_description_exists": true,
  "featured_image_exists": true,
  "alt_missing_count": 1,
  "modified_at": "..."
}
```

중요:

한국어 콘텐츠에서는 영어식 `word_count`만 품질 지표로 사용하면 부정확할 수 있으므로 `character_count`도 반드시 포함합니다.

---

# 22. Phase 1 테스트

처음부터 454개 전체를 테스트하지 않습니다.

우선 WordPress 게시글 **5개만** 읽습니다.

선택은 가능하면:

```text
KO 3개
EN 1개
JA 1개
```

로 합니다.

각 글에서 다음 값이 정확한지 확인합니다.

```text
wordpress_id
content_id
language
slug
title
content
meta_description
images
featured image
published_at
modified_at
```

---

# 23. Phase 1 성공 조건

다음이 모두 충족되면 Phase 1 성공입니다.

```text
WordPress에서 글 5개 정상 조회
기존 slug 일치
content_id 일치
language 일치
본문 손실 없음
이미지 정보 정상
SEO 정보 확인
현재 프론트엔드에 영향 없음
WordPress 데이터 변경 없음
```

---

# 24. Phase 1 완료 후 멈추세요

매우 중요합니다.

Phase 1이 끝나면:

```text
Phase 1 완료
```

라고 보고하고 **작업을 중단합니다.**

사용자의 승인을 받지 않고 Phase 2를 구현하지 마세요.

---

# 25. Phase 2 — Revision / Preview

Phase 1 승인 후에만 구현합니다.

AI가 실제 published post를 즉시 덮어쓰지 않도록 revision 계층을 추가합니다.

기본 워크플로:

```text
READ
↓
ANALYZE
↓
CREATE REVISION
↓
PREVIEW
↓
HUMAN REVIEW
↓
APPLY
```

---

# 26. 원본 직접 수정 금지

AI가 작성한 수정본은 기본적으로 실제 Published Post를 바로 수정하지 않습니다.

가능하면:

```text
Revision
Pending Review
Preview
```

구조를 사용합니다.

---

# 27. 수정 전 백업

실제 변경을 적용하기 전 반드시 원본을 복구할 수 있어야 합니다.

WordPress native revision 기능이 충분하다면 우선 재사용합니다.

별도 revision DB를 만들기 전에 기존 WordPress revision 기능을 조사합니다.

---

# 28. Revision 데이터

최소한 다음을 기록합니다.

```text
wordpress_id
content_id
revision_id
previous_title
previous_content
new_title
new_content
previous_meta_description
new_meta_description
created_at
source
reason
```

---

# 29. 동시 수정 방지

AI가 글을 읽은 후 관리자가 WordPress에서 직접 수정했을 가능성을 고려합니다.

optimistic locking을 적용합니다.

예:

```json
{
  "expected_modified_at": "2026-08-12T10:00:00"
}
```

현재 WordPress의 modified 시간이 달라졌다면 적용하지 않습니다.

오류:

```text
POST_CHANGED_SINCE_READ
```

---

# 30. slug 보호

기존 발행 콘텐츠의 slug는 원칙적으로 변경하지 않습니다.

서버 수준에서 보호합니다.

```text
ALLOW_SLUG_CHANGE=false
```

AI 수정 요청에 slug가 포함되어 있어도 기본적으로 무시하거나 거부합니다.

---

# 31. 삭제 금지

다음 기능은 AI 시스템에 제공하지 않습니다.

```text
DELETE POST
DELETE MEDIA
DELETE USER
DELETE CATEGORY
DELETE TAG
```

초기 버전에는 delete endpoint 자체를 만들지 않는 것을 권장합니다.

---

# 32. 자동 발행 금지

기본:

```text
ALLOW_AUTO_PUBLISH=false
```

AI가 수정했다고 바로 Publish하지 않습니다.

---

# 33. Phase 3 — Media

Phase 2가 충분히 테스트된 후 진행합니다.

목표:

```text
이미지 업로드
ALT 수정
Featured Image 설정
본문 이미지 삽입
```

---

# 34. 기존 이미지 처리 시스템 먼저 조사

현재 프론트엔드가 WordPress 이미지를 어떤 식으로 처리하는지 확인합니다.

예:

```text
WordPress original URL
Next/Image
remotePatterns
Cloudinary
CDN
Image proxy
custom image optimizer
```

새 이미지 시스템을 만들기 전에 기존 시스템을 그대로 활용합니다.

---

# 35. WordPress Media Library 업로드

향후 ChatGPT가 생성한 이미지 파일을 WordPress Media Library에 업로드할 수 있도록 합니다.

가능하면 WordPress REST API `/wp/v2/media`를 사용합니다.

단, 현재 프로젝트에 media upload 구현이 있으면 재사용합니다.

---

# 36. 이미지 메타데이터

지원:

```text
title
alt_text
caption
description
content_id
image_number
language
generation_source
```

---

# 37. 이미지 ALT

이미지가 업로드되면 ALT를 WordPress Media metadata에 저장합니다.

본문 HTML의 `alt` 값만 임시로 넣는 것이 아니라 실제 Media Library의 alt metadata와 동기화되도록 합니다.

---

# 38. 이미지 최적화

현재 프로젝트에서 이미지 최적화 파이프라인이 있다면 재사용합니다.

없다면 향후 다음을 고려합니다.

```text
WebP
최대 폭 1600px
합리적인 compression
EXIF 제거
SEO-friendly filename
```

---

# 39. 본문 이미지 삽입

이미지를 다음 기준으로 배치할 수 있게 합니다.

```text
첫 번째 H2 이후
특정 H2 이후
특정 block 이후
본문 시작 후
본문 끝 전
```

Gutenberg 콘텐츠를 사용하는 경우 Gutenberg block 구조를 깨뜨리지 않습니다.

---

# 40. 마젠타랩 이미지 생성 원칙

향후 ChatGPT가 본문 이미지를 생성할 때 다음 브랜드 규칙을 따릅니다.

기본 이미지 스타일:

```text
Hyper-realistic 3D render style, photorealistic appearance
```

안심이가 등장할 경우 반드시 다음 문장을 포함합니다.

```text
A brown dachshund wearing round-rimmed glasses and holding a small gold magnifying glass looks as if he is wearing a white lab coat. He is a researcher, and his name is Ansim.
```

---

# 41. 이미지 운영 원칙

본문 이미지는 무조건 많은 수를 생성하지 않습니다.

일반 콘텐츠:

```text
2~4개
```

HUB 콘텐츠:

```text
필요할 경우 4~6개
```

이미지가 글 이해에 실질적으로 도움이 되는 경우에만 생성합니다.

---

# 42. 이미지 중복 방지

가능하면 다음 정보를 저장할 수 있도록 설계합니다.

```text
content_id
prompt_hash
image_hash
generation_date
```

유사 이미지 반복 생성을 줄입니다.

---

# 43. Phase 4 — Controlled Update

충분한 테스트 후에만 실제 Published 콘텐츠 업데이트 기능을 추가합니다.

한 번에 454개를 업데이트하지 않습니다.

기본 Batch 제한:

```text
READ = 100
ANALYZE = 100
CREATE REVISION = 20
APPLY = 5~10
DELETE = 0
```

---

# 44. Apply 전 반드시 Diff 제공

사용자가 적용 전에 다음 변경 사항을 볼 수 있어야 합니다.

```text
Title Before / After
Content Before / After
Meta Description Before / After
Images Before / After
ALT Before / After
```

가능하면 관리자 화면에 Diff Viewer를 제공합니다.

---

# 45. Apply 후 Frontend 검증

WordPress 수정 성공만으로 작업이 끝난 것으로 판단하지 않습니다.

실제 마젠타랩 프론트엔드 URL에서 확인합니다.

검사:

```text
HTTP 200
제목
본문
이미지
canonical
meta description
slug
content_id
렌더링 오류
```

---

# 46. Cache Revalidation

콘텐츠 수정 후 기존 프로젝트가 사용하는 cache revalidation 방식을 사용합니다.

새로운 캐시 무효화 시스템을 중복 구현하지 않습니다.

현재 프로젝트의:

```text
revalidatePath
revalidateTag
ISR
custom revalidation API
```

중 실제 사용 방식을 조사하여 그대로 활용합니다.

---

# 47. Cache Revalidation은 자동으로 남발하지 않습니다

모든 수정 때 전체 사이트 cache purge를 하지 않습니다.

가능하면 해당 콘텐츠의:

```text
post URL
category
관련 tag
```

정도만 선택적으로 갱신합니다.

기존 캐시 운영 정책이 있다면 그것이 우선입니다.

---

# 48. content_id / slug 보존 원칙

기존 `content_id`는 원칙적으로 유지합니다.

기존 발행 slug도 원칙적으로 유지합니다.

글 제목과 본문을 대폭 수정하더라도 검색 의도가 동일하다면 slug를 변경하지 않습니다.

---

# 49. slug 변경이 필요한 경우

자동 변경하지 않습니다.

향후 AI 분석 결과에 다음 중 하나만 표시할 수 있습니다.

```text
유지 권장
변경 검토
변경 + 301 필요
```

실제 변경은 별도 승인 후 실행합니다.

---

# 50. 마젠타랩 콘텐츠 AI 품질 데이터

향후 각 콘텐츠에 AI audit 결과를 저장할 수 있게 설계합니다.

예:

```text
ai_score
ai_status
ai_last_reviewed
medical_risk
thin_content
adsense_risk
action
```

---

# 51. 콘텐츠 상태

다음 분류를 사용합니다.

```text
green
yellow
red
noindex_candidate
merge_candidate
```

의미:

```text
green = 유지
yellow = 개선 권장
red = 대폭 수정 필요
noindex_candidate = 색인 제외 검토
merge_candidate = 통합 검토
```

---

# 52. AdSense Audit 확장 가능성

향후 다음 항목을 분석할 수 있도록 합니다.

```text
thin content
duplicate structure
template repetition
missing evidence
weak search intent
low unique value
translation similarity
missing image
missing ALT
missing table
weak medical sourcing
```

단, 단순 규칙만으로 실제 AdSense 승인 여부를 확정하는 기능은 만들지 않습니다.

`risk signal` 형태로 사용합니다.

---

# 53. 마젠타랩 콘텐츠 작성 기준

향후 ChatGPT가 수정하는 콘텐츠의 브랜드는 `안심이(Ansim-i)`입니다.

목표는:

```text
AI가 만든 반려동물 글
```

이 아니라:

```text
안심이가 전문자료와 반려동물 생활 데이터를 조사해
보호자에게 쉽게 설명해주는
근거 기반 펫 케어 연구 플랫폼
```

입니다.

---

# 54. 기본 콘텐츠 구조

```text
[분류]

[제목]

[요약]

[공감]

[GEO/SEO 요약 테이블]

[본문]

[근거]
```

본문에는:

```text
후킹
H2
H3
짧은 문단
표
필요한 이미지
근거 설명
```

을 사용합니다.

---

# 55. 의료·영양 콘텐츠

의료, 질환, 영양 콘텐츠는 기존 문장을 그대로 신뢰하지 않고 최신 신뢰 자료를 다시 확인하는 것을 전제로 합니다.

우선 근거:

```text
AAHA
WSAVA
ACVIM
ACVS
Merck Veterinary Manual
FDA
정부기관
peer-reviewed research
수의학 교과자료
```

---

# 56. 의료 안전

AI가 다음을 보호자가 따라할 수 있는 처방 형태로 생성하지 않도록 합니다.

```text
약물 용량
인슐린 조절 공식
자가 구토 유도
꿀/시럽 용량
안전량
치사량
고정 치료시간
```

개별 환자의 치료는 담당 수의사가 결정한다는 원칙을 유지합니다.

---

# 57. KO / EN / JA 운영

영어와 일본어 콘텐츠는 한국어 원문을 기계적으로 직역하는 방식으로 처리하지 않습니다.

의학적 근거와 핵심 정보 구조는 공유하되 자연스럽게 현지화합니다.

---

# 58. 내부링크 자동 생성은 현재 하지 않습니다

현재 단계에서는 AI가 존재 여부를 확인하지 않은 페이지를 내부링크로 자동 삽입하면 안 됩니다.

향후 WordPress 전체 콘텐츠 구조를 정확히 파악한 뒤 별도 기능으로 추가합니다.

---

# 59. Phase 5 — MCP

**이 단계는 지금 구현하지 않습니다.**

Phase 1~4가 실제 운영 환경에서 충분히 검증된 후 진행합니다.

MCP의 목적은 ChatGPT가 자연어로 기존 마젠타랩 시스템을 호출할 수 있게 하는 것입니다.

개념적 Tool:

```text
wordpress_list_posts
wordpress_get_post
wordpress_search_posts
wordpress_create_revision
wordpress_apply_revision
wordpress_rollback_post
wordpress_upload_media
wordpress_update_media
wordpress_insert_image
wordpress_get_content_audit
```

그러나 **현재 작업에서는 MCP 구현 코드를 작성하지 마세요.**

---

# 60. 최종적인 사용 방식

향후 시스템이 완성되면 사용자는 ChatGPT에서 다음처럼 요청할 수 있게 됩니다.

```text
마젠타랩의 한국어 건강 글을 분석해줘.
```

↓

기존 WordPress 연결 코드 사용

↓

WordPress 조회

↓

AI 분석

---

예:

```text
AdSense 저가치 위험이 높은 콘텐츠 20개를 찾아줘.
```

↓

Audit

↓

사용자가 선택

---

예:

```text
1~5번을 안심이 2.0 기준으로 다시 작성해줘.
```

↓

Revision 생성

↓

Preview

---

예:

```text
수정본 확인했어. 적용해줘.
```

↓

승인된 글만 WordPress 업데이트

↓

기존 캐시 시스템으로 revalidate

↓

Frontend 검증

---

# 61. 관리자 Content Manager

향후 필요하다면 기존 Admin 구조를 조사한 뒤 Content Manager 화면을 추가할 수 있습니다.

예:

```text
/admin/ai-content-manager
```

단, 이미 Admin 영역이 존재한다면 기존 구조를 사용합니다.

새로운 관리자 프레임워크를 만들지 않습니다.

---

# 62. 관리자 화면 기능

향후:

```text
전체 콘텐츠
언어
카테고리
AI Score
AdSense Risk
상태
마지막 검토일
Revision
```

필터:

```text
전체
🟢 유지
🟡 개선
🔴 수정
Noindex 후보
통합 후보
```

---

# 63. Audit Log

모든 실제 쓰기 작업은 기록합니다.

```text
timestamp
action
wordpress_id
content_id
before
after
request_id
source
status
```

---

# 64. 환경변수

기존 환경변수 체계를 우선 사용합니다.

없는 경우에만 추가합니다.

예:

```env
WP_BASE_URL=
WP_USERNAME=
WP_APPLICATION_PASSWORD=

AI_CONTENT_API_SECRET=

MAX_READ_BATCH=100
MAX_REVISION_BATCH=20
MAX_APPLY_BATCH=5

ALLOW_DELETE=false
ALLOW_AUTO_PUBLISH=false
ALLOW_SLUG_CHANGE=false
ENABLE_MEDIA_UPLOAD=false
ENABLE_NOINDEX=false
```

초기 Phase 1에서는:

```env
ALLOW_DELETE=false
ALLOW_AUTO_PUBLISH=false
ALLOW_SLUG_CHANGE=false
ENABLE_MEDIA_UPLOAD=false
ENABLE_NOINDEX=false
```

를 유지합니다.

---

# 65. 보안 원칙

필수:

```text
HTTPS
서버 측 인증정보
환경변수
request validation
rate limit
audit log
CORS 제한
HTML sanitization
권한 최소화
```

WordPress 관리자 비밀번호를 코드에 넣지 않습니다.

가능하면 AI 전용 WordPress 계정과 Application Password를 사용합니다.

---

# 66. AI 전용 WordPress 계정

필요하다면 향후:

```text
magentalab_ai
```

같은 별도 계정을 사용합니다.

권한:

```text
read posts
edit posts
create revisions
upload media
edit media metadata
```

금지:

```text
manage users
manage plugins
manage themes
change site settings
delete users
install plugins
edit plugins
update core
```

---

# 67. Rate Limit

WordPress에 과도한 요청이 가지 않도록 합니다.

예:

```text
READ 100/minute
WRITE 20/minute
MEDIA 10/minute
```

실제 서버 사양과 기존 트래픽에 맞게 조정합니다.

---

# 68. Error Codes

명확한 오류를 반환합니다.

예:

```text
POST_NOT_FOUND
CONTENT_ID_NOT_FOUND
AUTH_FAILED
SLUG_CHANGE_PROTECTED
PUBLISH_NOT_ALLOWED
DELETE_NOT_ALLOWED
POST_CHANGED_SINCE_READ
MEDIA_UPLOAD_FAILED
REVISION_NOT_FOUND
FRONTEND_CHECK_FAILED
```

---

# 69. 절대로 하지 말아야 할 것

이번 작업에서 다음 행동을 하지 마세요.

### 1

기존 WordPress 연동 코드를 확인하지 않고 새로운 WordPress client부터 만드는 것.

### 2

기존 API가 있는데 유사 API를 중복해서 추가하는 것.

### 3

기존 type/interface가 있는데 같은 타입을 새로 만드는 것.

### 4

캐시 구조를 이해하지 않고 revalidation 방식을 교체하는 것.

### 5

454개 게시글을 한 번에 수정하는 것.

### 6

기존 slug를 자동으로 변경하는 것.

### 7

AI 수정 후 즉시 자동 Publish 하는 것.

### 8

WordPress 게시글이나 이미지를 삭제하는 기능을 초기부터 제공하는 것.

### 9

Phase 1 검증 전에 MCP를 만드는 것.

### 10

Phase 1 검증 전에 Media Upload를 활성화하는 것.

---

# 70. 이번 요청에서 실제로 수행해야 하는 범위

이번 요청의 작업 범위는 **Phase 0 + Phase 1까지만**입니다.

## STEP 1

현재 프로젝트 전체에서 WordPress 관련 코드를 조사합니다.

## STEP 2

현재 WordPress → Frontend 흐름을 파악합니다.

## STEP 3

재사용 가능한 기존 코드와 부족한 기능을 정리합니다.

## STEP 4

Phase 1 READ ONLY 구현 계획을 작성합니다.

## STEP 5

필요한 최소 코드만 수정합니다.

## STEP 6

WordPress 게시글 5개를 READ ONLY로 가져옵니다.

## STEP 7

다음 데이터를 확인합니다.

```text
wordpress_id
content_id
language
slug
title
content
meta_description
images
featured_image
published_at
modified_at
```

## STEP 8

현재 마젠타랩 프론트엔드가 전혀 영향받지 않았는지 확인합니다.

## STEP 9

결과를 사용자에게 보고합니다.

## STEP 10

여기서 멈춥니다.

---

# 71. 작업 완료 보고 형식

Phase 0/1 완료 후 다음 형식으로 보고해주세요.

```text
[기존 구조 분석]

WordPress 연결 파일:
-

사용 중인 함수:
-

WordPress Endpoint:
-

인증 방식:
-

content_id 위치:
-

language 위치:
-

SEO 구조:
-

이미지 구조:
-

Cache 구조:
-

재사용한 코드:
-

새로 추가한 코드:
-

[Phase 1 테스트]

조회한 게시글:
5개

KO:
EN:
JA:

content_id 정상:
slug 정상:
content 정상:
meta 정상:
image 정상:
frontend 영향 없음:

[보안 확인]

평문 Secret 발견:
환경변수 필요:
위험 요소:

[다음 단계]

Phase 2 시작 가능 여부:

현재 상태:
Phase 1에서 작업 중지
```

---

# 72. 최종 핵심 원칙

이번 프로젝트에서 가장 중요한 것은 많은 기능을 빠르게 만드는 것이 아닙니다.

**이미 운영 중인 마젠타랩 시스템을 절대로 깨뜨리지 않으면서 AI 편집 기능을 안전하게 추가하는 것**입니다.

모든 판단의 우선순위는:

```text
1. 기존 코드 재사용
2. 기존 SEO 자산 보호
3. 기존 URL 보호
4. WordPress 데이터 보호
5. 프론트엔드 안정성
6. 캐시 안정성
7. AI 자동화
```

입니다.

그리고 AI 콘텐츠 작업의 최종 원칙은 반드시:

```text
READ
↓
ANALYZE
↓
REVISION
↓
HUMAN REVIEW
↓
APPLY
```

로 유지합니다.

---

# 지금 바로 실행할 첫 명령

**현재 코드를 수정하기 전에 프로젝트 전체에서 기존 WordPress 연동 구조를 먼저 조사해주세요.**

특히 WordPress REST API를 호출하는 파일, 게시글 데이터를 변환하는 함수, SEO metadata 생성 코드, 이미지 처리 코드, KO/EN/JA 언어 처리 코드, cache/revalidation 코드를 모두 찾으세요.

그 결과를 먼저 설명한 뒤, 기존 코드를 최대한 재사용하여 **Phase 1 READ ONLY만 구현해주세요.**

처음에는 게시글 5개만 조회하여 정확성을 검증하세요.

**Phase 1 테스트가 성공하더라도 Phase 2, Media Upload, MCP 구현은 시작하지 말고 반드시 멈춰주세요.**

---

## Phase 6: Magentalab MCP Integration

### 6.1 Read-Only MCP (Stateless Streamable HTTP)
- **아키텍처**: `@modelcontextprotocol/sdk`의 `WebStandardStreamableHTTPServerTransport`를 활용하여 Vercel Serverless 환경에 맞춘 완전 무상태(Stateless) HTTP 응답 방식을 채택합니다 (`enableJsonResponse: true`, `sessionIdGenerator: undefined`).
- **라우팅**: 모든 `GET`/`POST` 요청은 매 요청마다 새로 인스턴스화된 MCP 서버와 Transport를 통해 처리되므로 Serverless Function 간 상태 공유(globalThis Map 등)에 의존하지 않고 어떠한 Vercel Instance에서도 일관된 결과를 반환합니다.
- **인증**: `Authorization: Bearer <AI_CONTENT_API_SECRET>`를 사용하여 ChatGPT Client 요청을 검증합니다.
- **Tools (Read-Only)**:
  - `magentalab_list_posts`: 발행된 게시물 목록 조회
  - `magentalab_get_post`: 단일 게시물 및 메타데이터 읽기
  - `magentalab_get_audit`: 특정 게시물의 최신 Audit Log 조회
  - `magentalab_get_revision`: Revision 데이터 조회
  - `magentalab_get_revision_diff`: Revision과 Live 간 Diff 조회
  - `magentalab_get_revision_preview`: Revision Preview 링크/데이터 조회
  - `magentalab_get_review_queue`: Human Review 대기열 조회
- **제한 사항**: 어떠한 WordPress Mutation 기능(Create, Update, Delete)이나 Publish/Revision Approve 기능도 이 Phase에서는 제공되지 않습니다.

### 6.2 ~ 6.4 (향후 로드맵)
- 6.2 Revision 생성 및 증거 첨부
- 6.3 Human Review 승인 연동 (옵션)
- 6.4 최종 Batch Apply 연동

---
name: magentalab-content-engineering
description: MagentaLab Blog의 WordPress AI Integration, 콘텐츠 고도화, Evidence Pipeline, Revision/Apply/Rollback 안전 검증을 위한 개발 스킬입니다.
---

# Kodari Custom Development & Security Skill

이 스킬은 1인 창업가(Solo Entrepreneur)의 AI 수익화 및 웹 페이지 제작을 지원하는 개발 매니저 **Kodari**의 핵심 개발 원칙과 안전한 개발을 위한 보안 수칙을 정의합니다.

## Instruction Priority

WordPress AI Integration 관련 작업에서는
`docs/wordpress-ai-integration.md`의 최신 Phase 지침이
이 SKILL.md의 과거 세부 규칙보다 우선한다.

두 문서가 충돌할 경우 최신 Phase 문서를 따른다.


## 1. Kodari Persona & Core Competencies

- **Technical Implementation Guidance**: Next.js, PWA, Vanilla CSS 아키텍처 전문가.
- **Solo Entrepreneur Project Management**: 수익화(Monetization)로 직결되는 작업 우선순위 지정.
- **AI Monetization Strategy**: 캐릭터(예: 안심이)를 활용한 수익성 높은 웹 경험 구축.
- **Emotional Support**: 격려와 회복 탄력성을 바탕으로 "다음 단계(What's next?)"에 집중.


## 2. Rules of Engagement

1. **Concise & Actionable**: 군더더기 없이 즉시 동작하는 코드와 절차를 제공합니다.
2. **ROI-Driven**: 기능 구현 시 항상 사용자나 비즈니스에 어떤 가치(ROI)를 주는지 자문합니다.
3. **Proactive Debugging**: 단순 에러 보고에 그치지 않고, 해결책과 검증 경로를 함께 제안합니다.
4. **Tone**: 직설적이되 지원적이고, 약간의 위트가 섞인 프로페셔널한 어조를 유지합니다.


## 3. 에이전트 역할별 지침

- **기획 및 아키텍처 설계 (PM)**: 사용자의 자연어 프롬프트를 분석하여 제품 요구사항 문서(PRD)를 작성하고, 사이트맵과 와이어프레임을 동적으로 생성합니다.
- **제너레이티브 UI/UX (디자이너)**: 브랜드 가이드라인에 맞춰 Tailwind CSS, React 등을 기반으로 반응형 레이아웃과 미적인 UI 컴포넌트를 즉각적으로 생성합니다.
- **풀스택 코드 생성 (엔지니어)**: 프론트엔드뿐만 아니라 데이터베이스 스키마 생성, API 엔드포인트 구축, 인증 시스템(예: Supabase 연동) 등 백엔드 환경까지 다중 파일 스캐폴딩(Scaffolding)을 동시에 진행합니다.
- **QA 및 보안 검증 (테스터)**: 코드가 생성됨과 동시에 단위/통합 테스트를 작성하고, 접근성(WCAG) 및 보안 취약점을 스캔하여 오류를 스스로 수정(Self-correction)합니다.
- **배포 및 최적화 (DevOps/SEO)**: Dockerfile을 생성하여 클라우드에 자동 배포하고, 코어 웹 바이탈(Core Web Vitals) 및 AI 검색(AEO/GEO)에 맞춘 SEO 최적화를 수행합니다.


## 4. 개발 및 보안 방어 수칙

- **비밀 정보 관리 (Secrets Management)**: 소스 코드를 생성할 때 절대 API 키나 자격 증명을 파일에 하드코딩하지 마십시오. 모든 민감한 정보는 반드시 환경 변수(`.env`)로 분리하여 로드하도록 구성하십시오. 또한, 코드 생성 전 깃(Git) 히스토리에 유출된 크리덴셜이 없는지 스캔하십시오.
- **데이터베이스 및 인증 방어 (Database & Auth Hardening)**: 프론트엔드의 화면 숨김 처리로 권한을 제어하지 마십시오. 모든 데이터 읽기 및 쓰기 엔드포인트는 백엔드 서버에서 사용자 세션과 권한을 직접 검증해야 합니다. Supabase나 Postgres를 사용할 경우 데이터 격리를 위해 반드시 행 수준 보안(RLS) 정책을 생성하고 활성화하십시오.
- **안전한 의존성 검증 (Secure Dependency Verification)**: 새로운 npm, Python 패키지 등의 라이브러리 설치를 제안하거나 실행하기 전에, 해당 패키지가 실제 레지스트리에 존재하는지, 오타 기반 공격(Typosquatting/Slopsquatting)은 아닌지 검증하십시오. 설치 후에는 `npm audit` 등을 통해 취약점 검사를 수행하십시오.
- **입력값 검증 및 인젝션 방어 (Input Validation & Anti-Injection)**: 모든 외부 및 사용자 입력은 신뢰할 수 없는 데이터로 간주하고 서버 측에서 엄격하게 검증 및 필터링하십시오. 데이터베이스 쿼리를 작성할 때는 반드시 문자열 연결 대신 매개변수화된 쿼리(Parameterized queries) 또는 안전한 ORM을 사용하여 SQL 인젝션을 방어하십시오.
- **자체 테스트 및 외부 검증 (Automated Test Generation)**: 코드를 구현한 직후 해당 로직을 검증하는 자동화된 단위 테스트(Unit test)와 E2E 테스트를 작성하여 실행하십시오. 테스트에는 의도된 정상 동작뿐만 아니라, 권한 없음(403), 잘못된 입력(400), 타임아웃 등 부정적인 엣지 케이스 시나리오가 반드시 포함되어야 합니다.


## 5. 애드센스 심사 통과 전문가

사용자가 업무를 요청했을 때 애드센스 심사에 명백히 불리한 변경이라면,
변경 내용을 먼저 설명하고 사용자의 승인을 받은 뒤 진행한다.


## 6. 마젠타랩 콘텐츠 고도화 핵심 표준

454개 콘텐츠 고도화 시 `docs/wordpress-ai-integration.md`의 최신 Phase 지침을 최우선 적용한다.

핵심 원칙:

1. 콘텐츠 작성 구조는 기본적으로 다음 요소를 유지한다.

   - SEO 제목
   - Quick Summary
   - 공감
   - 도입부
   - GEO/SEO 요약표
   - H2/H3 본문
   - 이미지 placeholder / ALT / 이미지 프롬프트
   - Ansim Summary
   - Evidence

2. `excerpt`, `meta_description`, `ansim_summary`는 서로 다른 역할의 데이터다.

   - `excerpt` / `meta_description`
     → SEO 및 검색결과용

   - `ansim_summary`
     → 프론트엔드의 “안심 연구원의 돌보기 요약” 전용

   `excerpt` 또는 `meta_description`을
   `ansim_summary`로 자동 복사하거나 재사용하지 않는다.

3. 기존 `content_id`와 slug는 기본적으로 유지한다.

4. 기존 Featured Media는 기본적으로 유지한다.

5. 원고의 다음 텍스트는 절대 삭제하거나 임의 변형하지 않는다.

   - `[이미지 X]`
   - `alt 태그:`
   - `이미지 프롬프트:`
   
   단, 라이브 사이트에 프롬프트 텍스트가 노출되는 것을 방지하기 위해 반드시 다음과 같이 워드프레스 사용자 정의 HTML 블록(`wp:html`)으로 감싸서 삽입한다:
   ```html
   <!-- wp:html -->
   <div style="display:none;" class="ai-image-prompt">
   [이미지 X]<br>
   alt 태그: ...<br>
   이미지 프롬프트: ...
   </div>
   <!-- /wp:html -->
   ```

6. Batch Rewrite에서는 WordPress 본문 이미지를 자동 삽입하거나
   기존 WordPress 이미지 HTML을 새 placeholder와 자동 병합하지 않는다.

7. 실제 이미지 생성 및 WordPress 삽입은 별도 Media 단계에서 수행한다.

8. 안심이가 등장하는 이미지 생성 시
   승인된 안심이 캐릭터 시트를 참조 기준으로 사용한다.

9. 의료·질병·영양·응급처치 관련 글은
   위험한 자가치료, 투약 수치, 고정 치료시간,
   안전량·치사량, 과도한 단정 표현을 안전하게 교정한다.

10. `[근거]` 섹션은 WordPress Article Content HTML에 직접 삽입하지 않는다.

11. `[근거]` 데이터는 절대 폐기하지 않는다.

    Evidence Pipeline을 통해 다음 구조로 저장한다.

    - `keyInsight`
    - `cautionNote`
    - `references[]`
      - `title`
      - `org`
      - `type`
      - `url`

12. Live custom Evidence가 존재하면
    프론트엔드는 해당 Evidence를 최우선으로 표시한다.

    우선순위:

    1) Live custom Evidence
    2) 기존 topic/category 기반 hardcoded fallback

13. 기존 hardcoded Evidence는 삭제하지 않는다.

    custom Evidence가 없는 legacy 콘텐츠를 위한
    fallback으로 유지한다.

14. custom Evidence가 존재하는데 hardcoded fallback이 대신 표시되면 FAIL로 간주한다.

15. Evidence 저장 실패 시 해당 Revision의 Apply를 중단한다.

16. Apply 전 Backup에는 최소 다음 데이터를 보존한다.

    - title
    - content
    - excerpt
    - meta_description
    - ansim_summary
    - evidence
    - featured_media
    - slug
    - status
    - categories
    - tags

17. Apply 성공은 WordPress write 성공만으로 판정하지 않는다.

    반드시 post-apply verification이 모두 PASS한 뒤에만
    `revision.status = applied` 로 저장한다.

18. Apply/Rollback verification은
    canonical normalization 후 exact equality를 사용한다.

    허용 normalization:

    - Unicode NFC
    - zero-width character 제거
    - HTML entity decode
    - WordPress wpautop 차이
    - whitespace normalization
    - 확인된 plugin-generated TOC DOM 제거

    금지:

    - `includes`
    - similarity threshold
    - word overlap
    - character-frequency overlap
    - fuzzy matching

19. Easy Table of Contents 등 plugin-generated DOM은
    실제 콘텐츠 mutation으로 간주하지 않는다.

    단, 모든 `<nav>`를 제거하는 broad selector를 사용하지 않는다.
    확인된 plugin DOM만 제거한다.

20. Rollback은 다음을 exact restore 해야 한다.

    - title
    - content
    - excerpt
    - meta_description
    - ansim_summary
    - evidence
    - featured_media
    - 보호 필드

    rollback verification PASS 후에만
    `revision.status = rolled_back` 로 저장한다.

21. verification 실패 상태에서
    `revision.status = applied` 또는 `rolled_back`으로 남겨서는 안 된다.

22. ChatGPT가 작성한 콘텐츠를 Revision으로 전달할 때
    중간 에이전트가 내용을 요약·재작성·병합하지 않는다.

    필요 시 SHA-256을 사용하여:

    payload content
    ==
    stored revision content

    무결성을 검증한다.

23. 프론트엔드 콘텐츠 배치는 기본적으로 다음을 따른다.

    Article Content
    → VeterinaryReferencesSection
    → Ansim Summary
    → CalculatorBanner
    → Share / Tags / Related Posts

    단, 최신 frontend specification에서 위치가 변경된 경우
    최신 명세를 우선한다.


## 7. 454개 글로벌 콘텐츠 재편집 SOP

1. KO / EN / JA 동일 주제 글은 slug base 기준으로 그룹화한다.

2. 동일 주제의 수의학 근거는 공유할 수 있지만,
   설명·안전 문구·ansim_summary는 언어별로 자연스럽게 현지화한다.

3. `content_id`와 기존 slug는 유지한다.

4. `[이미지 X]`, ALT, 이미지 프롬프트 텍스트는 원고 그대로 보존한다.

5. `[근거]`는 본문에서 분리하되 Evidence 데이터로 반드시 저장한다.

6. 본문은 마지막 H2/H3 및 Ansim Summary까지 보존하며
   후반부 잘림을 허용하지 않는다.

7. `excerpt`, `meta_description`, `ansim_summary`, `evidence`를
   서로 다른 데이터로 취급한다.

8. WordPress / 전체 콘텐츠 CSV / classification CSV의 3중 데이터 구조를 유지한다.

9. 실제 대량 Apply보다 Revision + Human Review를 우선한다.

10. Batch Rewrite에서 콘텐츠를 중간 LLM이 요약하거나 재작성하지 않는다.

11. Batch Revision 생성 시 source_modified_at optimistic lock을 유지한다.

12. Batch Apply 전 Evidence/Medical/Protected Field gate를 반드시 통과한다.


## 8. Cache Revalidation Rules

- 콘텐츠 수정 후 자동 `api/revalidate` 호출 금지.
- WordPress DB 및 구조화 데이터 업데이트는 정상 수행한다.
- `AUTO_CACHE_REVALIDATE=false`를 기본값으로 유지한다.
- 공개 프론트엔드 캐시는 사용자가 명시적으로 요청할 때만 갱신한다.
- Preview는 Revision 데이터를 직접 사용하여 항상 최신 수정본을 표시한다.
- Live Apply verification은 캐시된 프론트엔드가 아니라 authoritative no-cache source를 사용한다.


## 9. WordPress AI Integration

- WordPress/콘텐츠 자동화 관련 개발은 `docs/wordpress-ai-integration.md`를 기준으로 한다.
- 구현 전 기존 WordPress 연동 코드를 먼저 조사하고 중복 구현하지 않는다.
- 기존 `content_id`와 slug는 기본적으로 유지한다.
- 작업 순서는 다음을 따른다.

  READ
  → ANALYZE
  → REVISION
  → HUMAN REVIEW
  → DRY RUN
  → APPLY
  → VERIFY

- DELETE, AUTO PUBLISH, AUTO SLUG CHANGE는 기본 금지한다.
- Live Apply는 사용자의 명시적 승인 후에만 실행한다.
- 의료/질병/영양/응급 콘텐츠는 `medical_reviewed=true` 확인 후 Apply한다.
- Evidence 저장 실패 시 Live Apply를 금지한다.
- Apply 전 Backup 생성이 확인되어야 한다.
- Apply verification 실패 시 자동 rollback을 시도한다.
- rollback verification까지 실패하면 추가 mutation을 중단하고 수동 검수 상태로 전환한다.


## 10. WordPress REST Runtime Rules

- Vercel Production 서버에서 WordPress REST API의 인증된 GET/POST 요청은 허용한다.
- `READ → ANALYZE → REVISION → HUMAN REVIEW → DRY RUN → APPLY → VERIFY` 흐름에 필요한 WordPress REST 호출은 정상 운영 기능으로 간주한다.
- `AUTO_CACHE_REVALIDATE=false`는 프론트엔드 캐시 갱신만 제한하며, WordPress REST API 읽기/쓰기 요청을 차단하지 않는다.
- WordPress 인증은 Vercel 서버 환경변수의 Application Password를 사용한다.
- Production WordPress write는 승인된 Revision에 한해서만 허용한다.
- slug/delete/status 변경은 별도 승인 없이는 금지한다.
- MCP 및 verification에서 WordPress 최신 상태가 필요한 경우 no-cache authoritative read를 사용한다.
- WordPress plugin이 rendered HTML에 자동 삽입한 TOC DOM 등은 verification normalization 단계에서만 처리하고, 원본 콘텐츠를 임의 변경하지 않는다.
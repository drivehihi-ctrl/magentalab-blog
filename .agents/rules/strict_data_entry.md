---
name: Strict Evidence Data Entry Rule
description: Never modify or summarize user-provided evidence and summary text. Input it exactly as provided.
---

# Strict Evidence Data Entry Rule

When the user provides text for `ansim_summary`, `evidence` (`keyInsight`, `cautionNote`), or any other specific data entry task to be inputted into the system (e.g. via `magentalab_create_revision`), you MUST follow these rules:

1. **Exact Copy-Paste**: Do NOT summarize, modify, expand, or reduce the text the user provided. Input it *exactly* word-for-word.
2. **Do Not Add Unsolicited Explanations**: Do not append sentences like "기존 글의 단선적 인과관계를 제거하고..." unless the user explicitly wrote them in their block.
3. **Respect Formatting**: If the user provides a numbered list, keep the numbers. If they provide a specific prefix (e.g., "F형 공감:"), ensure you handle it exactly as required by the frontend parsing logic. For Ansim Summary, ensure a double line break (`\n\n`) is used before the empathy message if the frontend relies on `\n{2,}` for splitting, but *do not* alter the text content itself.

Failure to follow this rule will cause verification failures and severe frustration for the user. Act as a precise data-entry conduit.

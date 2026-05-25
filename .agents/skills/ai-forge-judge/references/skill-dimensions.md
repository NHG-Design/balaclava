# Skill-Specific Evaluation Dimensions (S1–S3)

Detailed scoring rubrics for dimensions that apply only when evaluating SKILL.md files.

---

## Tool vs Skill

| Concept | Essence | Function | Example |
|---------|---------|----------|---------|
| **Tool** | What model CAN do | Execute actions | bash, read_file, write_file, WebSearch |
| **Skill** | What model KNOWS how to do | Guide decisions | PDF processing, MCP building, frontend design |

**The equation**: `General Agent + Excellent Skill = Domain Expert Agent`

---

## S1: Specification Compliance — Especially Description (15 points)

**MANDATORY — Load the agentskills spec from `references/agentskills-spec.md` before scoring this dimension.** Score against the spec, not baked-in knowledge — requirements may have changed.

Does the Skill follow official format requirements? **Special focus on description quality.**

| Score | Criteria |
|-------|----------|
| 0–5 | Missing frontmatter or invalid format |
| 6–10 | Has frontmatter but description is vague or incomplete |
| 11–13 | Valid frontmatter, description has WHAT but weak on WHEN |
| 14–15 | Perfect: comprehensive description with WHAT, WHEN, and trigger keywords |

**Why description is THE MOST IMPORTANT field**:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SKILL ACTIVATION FLOW                                              │
│                                                                     │
│  User Request → Agent sees ALL skill descriptions → Decides which  │
│                 (only descriptions, not bodies!)     to activate    │
│                                                                     │
│  If description doesn't match → Skill NEVER gets loaded            │
│  If description is vague → Skill might not trigger when it should  │
│  If description lacks keywords → Skill is invisible to the Agent   │
└─────────────────────────────────────────────────────────────────────┘
```

**Description must answer THREE questions**:

1. **WHAT**: What does this Skill do? (functionality)
2. **WHEN**: In what situations should it be used? (trigger scenarios)
3. **KEYWORDS**: What terms should trigger this Skill? (searchable terms)

**Description quality checklist**:
- [ ] Lists specific capabilities (not just "helps with X")
- [ ] Includes explicit trigger scenarios ("Use when...", "When user asks for...")
- [ ] Contains searchable keywords (file extensions, domain terms, action verbs)
- [ ] Specific enough that Agent knows EXACTLY when to use it

---

## S2: Progressive Disclosure (15 points)

Does the Skill implement proper content layering?

Skill loading has three layers:
```
Layer 1: Metadata (always in memory)
         Only name + description
         ~100 tokens per skill

Layer 2: SKILL.md Body (loaded after triggering)
         Detailed guidelines, code examples, decision trees
         Ideal: < 200 lines

Layer 3: Resources (loaded on demand)
         references/, scripts/, assets/
         No limit
```

| Score | Criteria |
|-------|----------|
| 0–5 | Everything dumped in SKILL.md (>200 lines, no structure) |
| 6–10 | Has references but unclear when to load them |
| 11–13 | Good layering with MANDATORY triggers present |
| 14–15 | Perfect: decision trees + explicit triggers + "Do NOT Load" guidance |

**For Skills WITH references directory**, check Loading Trigger Quality:

| Trigger Quality | Characteristics |
|-----------------|-----------------|
| Poor | References listed at end, no loading guidance |
| Mediocre | Some triggers but not embedded in workflow |
| Good | MANDATORY triggers in workflow steps |
| Excellent | Scenario detection + conditional triggers + "Do NOT Load" guidance |

**For simple Skills** (no references, <100 lines): Score based on conciseness and self-containment.

---

## S3: Pattern Recognition (10 points)

Does the Skill follow an established pattern?

| Pattern | ~Lines | Key Characteristics | When to Use |
|---------|--------|---------------------|-------------|
| **Mindset** | ~50 | Thinking > technique, strong NEVER list, high freedom | Creative tasks requiring taste |
| **Navigation** | ~30 | Minimal SKILL.md, routes to sub-files | Multiple distinct scenarios |
| **Philosophy** | ~150 | Two-step: Philosophy → Express, emphasizes craft | Art/creation requiring originality |
| **Process** | ~200 | Phased workflow, checkpoints, medium freedom | Complex multi-step projects |
| **Tool** | ~300 | Decision trees, code examples, low freedom | Precise operations on specific formats |

| Score | Criteria |
|-------|----------|
| 0–3 | No recognizable pattern, chaotic structure |
| 4–6 | Partially follows a pattern with significant deviations |
| 7–8 | Clear pattern with minor deviations |
| 9–10 | Masterful application of appropriate pattern |

**The meta-question**: Would an expert in this domain, looking at this Skill, say:
> "Yes, this captures knowledge that took me years to learn"?

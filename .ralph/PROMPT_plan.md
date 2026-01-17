# Ralph Loop - Planning Mode

You are operating in **PLANNING MODE** as part of an autonomous Ralph Loop.

## Your Mission

Analyze the gap between specifications and current implementation, then generate or update the IMPLEMENTATION_PLAN.md with prioritized tasks.

## Context Files to Read

1. **AGENTS.md** - Project configuration, build commands, patterns
2. **specs/*.md** - Feature specifications and requirements
3. **IMPLEMENTATION_PLAN.md** - Current task list (may not exist yet)
4. **Source code** - Current implementation state

## Planning Process

### Step 1: Load Context

Read and understand:
- [ ] AGENTS.md for project conventions
- [ ] All files in specs/ directory
- [ ] Current IMPLEMENTATION_PLAN.md if it exists
- [ ] Key source files to understand current state

### Step 2: Gap Analysis

For each specification in specs/:
1. Identify what's already implemented
2. Identify what's missing or incomplete
3. Identify what doesn't match the spec
4. Note any technical debt or issues

### Step 3: Generate Tasks

Create tasks that are:
- **Atomic**: One clear deliverable per task
- **Testable**: Clear success criteria
- **Ordered**: Dependencies resolved, highest priority first
- **Sized**: Completable in one iteration (~30 min of Claude work)

### Step 4: Prioritize

Order tasks by:
1. **Blockers first** - Tasks that unblock other work
2. **Core functionality** - Essential features
3. **Tests** - Validation and safety nets
4. **Polish** - Nice-to-haves, cleanup

### Step 5: Write IMPLEMENTATION_PLAN.md

Use this format:

```markdown
# Implementation Plan

Generated: [timestamp]
Specs analyzed: [list of spec files]

## Status Summary

- Total tasks: X
- Completed: Y
- In Progress: Z
- Remaining: W

## Tasks

### High Priority

- [ ] **TASK-001**: [Task title]
  - Spec: [which spec this implements]
  - Files: [files to create/modify]
  - Acceptance: [how to verify completion]

- [ ] **TASK-002**: [Task title]
  ...

### Medium Priority

...

### Low Priority

...

## Completed

- [x] **TASK-000**: [Completed task]
  - Completed: [timestamp]
  - Notes: [any relevant notes]
```

## Vibe-Kanban Integration

If VIBE_KANBAN_PROJECT_ID is set:
1. Fetch current tasks from the project using list_tasks
2. Map high-level kanban tasks to IMPLEMENTATION_PLAN.md sections
3. Create new kanban tasks for major features not yet tracked
4. Update kanban task descriptions with sub-task references

## Output

1. Write the complete IMPLEMENTATION_PLAN.md
2. Summarize what changed:
   - New tasks added
   - Tasks marked complete
   - Priority changes
   - Spec coverage status

## Constraints

- Do NOT implement any code in planning mode
- Do NOT modify source files
- ONLY update IMPLEMENTATION_PLAN.md
- Keep task descriptions concise but clear
- Include file paths in task descriptions

## Begin

Start by reading AGENTS.md and the specs/ directory, then perform gap analysis.

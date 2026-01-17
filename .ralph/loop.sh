#!/bin/bash
#
# Ralph Loop - Autonomous AI Coding Workflow
#
# Usage: ./loop.sh [OPTIONS]
#
# Options:
#   -m, --mode MODE        Mode: 'plan' or 'build' (default: build)
#   -n, --iterations N     Max iterations, 0 = infinite (default: 0)
#   -p, --project ID       Vibe-kanban project ID for task sync
#   -b, --branch NAME      Git branch to work on (default: current branch)
#   --no-push              Skip git push after each iteration
#   --no-commit            Skip git commit after each iteration
#   --model MODEL          Claude model to use (default: opus)
#   --token-limit N        Token threshold for re-context (default: 95000)
#   --session-file FILE    File to track session stats (default: .ralph-session.json)
#   -v, --verbose          Enable verbose output
#   -h, --help             Show this help message
#
# Examples:
#   ./loop.sh                           # Run build mode indefinitely
#   ./loop.sh -m plan -n 1              # Run one planning iteration
#   ./loop.sh -m build -n 5 -p abc123   # 5 build iterations with kanban sync
#

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="${SCRIPT_DIR}/.ralph"

# Defaults
MODE="build"
MAX_ITERATIONS=0
PROJECT_ID=""
BRANCH=""
DO_PUSH=true
DO_COMMIT=true
MODEL="opus"
VERBOSE=false
TOKEN_LIMIT=95000
SESSION_FILE=".ralph-session.json"

# Token tracking
SESSION_TOKENS=0
SESSION_INPUT_TOKENS=0
SESSION_OUTPUT_TOKENS=0
TOTAL_TOKENS=0
TOTAL_COST=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

log() {
    echo -e "${BLUE}[ralph]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[ralph]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[ralph]${NC} $1"
}

log_error() {
    echo -e "${RED}[ralph]${NC} $1"
}

log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${CYAN}[ralph]${NC} $1"
    fi
}

show_help() {
    head -32 "$0" | tail -30 | sed 's/^# //' | sed 's/^#//'
    exit 0
}

# ============================================================================
# Token Tracking Functions
# ============================================================================

init_session_tracking() {
    SESSION_FILE="${SCRIPT_DIR}/${SESSION_FILE}"

    if [ -f "$SESSION_FILE" ]; then
        # Load existing session
        TOTAL_TOKENS=$(jq -r '.total_tokens // 0' "$SESSION_FILE" 2>/dev/null || echo 0)
        TOTAL_COST=$(jq -r '.total_cost // 0' "$SESSION_FILE" 2>/dev/null || echo 0)
        local prev_iterations=$(jq -r '.iterations // 0' "$SESSION_FILE" 2>/dev/null || echo 0)
        log_verbose "Loaded session: ${TOTAL_TOKENS} total tokens from ${prev_iterations} previous iterations"
    fi

    # Reset per-session counters
    SESSION_TOKENS=0
    SESSION_INPUT_TOKENS=0
    SESSION_OUTPUT_TOKENS=0
}

save_session_stats() {
    local now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$SESSION_FILE" <<EOF
{
  "last_updated": "${now}",
  "iterations": ${ITERATION},
  "session_tokens": ${SESSION_TOKENS},
  "session_input_tokens": ${SESSION_INPUT_TOKENS},
  "session_output_tokens": ${SESSION_OUTPUT_TOKENS},
  "total_tokens": ${TOTAL_TOKENS},
  "total_cost": ${TOTAL_COST},
  "mode": "${MODE}",
  "model": "${MODEL}",
  "project_id": "${PROJECT_ID:-null}"
}
EOF
    log_verbose "Session stats saved to ${SESSION_FILE}"
}

update_token_count() {
    local input_tokens="$1"
    local output_tokens="$2"

    SESSION_INPUT_TOKENS=$((SESSION_INPUT_TOKENS + input_tokens))
    SESSION_OUTPUT_TOKENS=$((SESSION_OUTPUT_TOKENS + output_tokens))
    SESSION_TOKENS=$((SESSION_INPUT_TOKENS + SESSION_OUTPUT_TOKENS))

    TOTAL_TOKENS=$((TOTAL_TOKENS + input_tokens + output_tokens))

    # Estimate cost (rough approximation)
    # Opus: ~$15/M input, ~$75/M output
    # Sonnet: ~$3/M input, ~$15/M output
    local input_cost=0
    local output_cost=0

    case "$MODEL" in
        opus)
            input_cost=$(echo "scale=6; $input_tokens * 0.000015" | bc 2>/dev/null || echo 0)
            output_cost=$(echo "scale=6; $output_tokens * 0.000075" | bc 2>/dev/null || echo 0)
            ;;
        sonnet)
            input_cost=$(echo "scale=6; $input_tokens * 0.000003" | bc 2>/dev/null || echo 0)
            output_cost=$(echo "scale=6; $output_tokens * 0.000015" | bc 2>/dev/null || echo 0)
            ;;
        *)
            # Default to sonnet pricing
            input_cost=$(echo "scale=6; $input_tokens * 0.000003" | bc 2>/dev/null || echo 0)
            output_cost=$(echo "scale=6; $output_tokens * 0.000015" | bc 2>/dev/null || echo 0)
            ;;
    esac

    local iter_cost=$(echo "scale=4; $input_cost + $output_cost" | bc 2>/dev/null || echo 0)
    TOTAL_COST=$(echo "scale=4; $TOTAL_COST + $iter_cost" | bc 2>/dev/null || echo 0)
}

should_recontext() {
    if [ "$SESSION_TOKENS" -ge "$TOKEN_LIMIT" ]; then
        return 0  # true - should recontext
    fi
    return 1  # false - continue
}

log_token_stats() {
    echo ""
    log "Token Usage:"
    log "  This session: ${SESSION_TOKENS} (in: ${SESSION_INPUT_TOKENS}, out: ${SESSION_OUTPUT_TOKENS})"
    log "  Total: ${TOTAL_TOKENS}"
    log "  Estimated cost: \$${TOTAL_COST}"

    local pct=$((SESSION_TOKENS * 100 / TOKEN_LIMIT))
    if [ "$pct" -ge 80 ]; then
        log_warn "  Context usage: ${pct}% of limit (${TOKEN_LIMIT})"
    else
        log "  Context usage: ${pct}% of limit (${TOKEN_LIMIT})"
    fi
}

check_dependencies() {
    local missing=()

    if ! command -v claude &> /dev/null; then
        missing+=("claude (Claude Code CLI)")
    fi

    if ! command -v git &> /dev/null; then
        missing+=("git")
    fi

    if ! command -v jq &> /dev/null; then
        missing+=("jq (for JSON parsing)")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        log_error "Missing required dependencies:"
        for dep in "${missing[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
}

# ============================================================================
# Parse Arguments
# ============================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            MODE="$2"
            shift 2
            ;;
        -n|--iterations)
            MAX_ITERATIONS="$2"
            shift 2
            ;;
        -p|--project)
            PROJECT_ID="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        --no-push)
            DO_PUSH=false
            shift
            ;;
        --no-commit)
            DO_COMMIT=false
            shift
            ;;
        --model)
            MODEL="$2"
            shift 2
            ;;
        --token-limit)
            TOKEN_LIMIT="$2"
            shift 2
            ;;
        --session-file)
            SESSION_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            ;;
    esac
done

# Validate mode
if [[ "$MODE" != "plan" && "$MODE" != "build" ]]; then
    log_error "Invalid mode: $MODE. Must be 'plan' or 'build'"
    exit 1
fi

# ============================================================================
# Setup
# ============================================================================

check_dependencies

# Determine prompt file location
if [ -f "${RALPH_DIR}/PROMPT_${MODE}.md" ]; then
    PROMPT_FILE="${RALPH_DIR}/PROMPT_${MODE}.md"
elif [ -f "${SCRIPT_DIR}/PROMPT_${MODE}.md" ]; then
    PROMPT_FILE="${SCRIPT_DIR}/PROMPT_${MODE}.md"
else
    log_error "Prompt file not found: PROMPT_${MODE}.md"
    log_error "Looked in: ${RALPH_DIR}/ and ${SCRIPT_DIR}/"
    exit 1
fi

# Get current branch if not specified
if [ -z "$BRANCH" ]; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
fi

# ============================================================================
# Pre-flight Checks
# ============================================================================

log "Ralph Loop Starting"
log "Mode: ${MODE}"
log "Branch: ${BRANCH}"
log "Model: ${MODEL}"
log "Max iterations: ${MAX_ITERATIONS:-unlimited}"
log "Token limit: ${TOKEN_LIMIT}"
[ -n "$PROJECT_ID" ] && log "Vibe-kanban project: ${PROJECT_ID}"
log "Prompt file: ${PROMPT_FILE}"
echo ""

# Initialize token tracking
init_session_tracking

# Check for uncommitted changes
if [ "$DO_COMMIT" = true ]; then
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        log_warn "Working directory has uncommitted changes"
        log_warn "These will be included in the first iteration's commit"
        echo ""
    fi
fi

# ============================================================================
# Sync Function (Vibe-Kanban Integration)
# ============================================================================

sync_kanban_tasks() {
    if [ -z "$PROJECT_ID" ]; then
        return 0
    fi

    log_verbose "Syncing tasks from vibe-kanban project: $PROJECT_ID"

    # Use the sync script if available
    if [ -f "${RALPH_DIR}/sync-kanban.sh" ]; then
        "${RALPH_DIR}/sync-kanban.sh" "$PROJECT_ID" || {
            log_warn "Kanban sync failed, continuing anyway"
        }
    elif [ -f "${SCRIPT_DIR}/sync-kanban.sh" ]; then
        "${SCRIPT_DIR}/sync-kanban.sh" "$PROJECT_ID" || {
            log_warn "Kanban sync failed, continuing anyway"
        }
    else
        log_verbose "No sync-kanban.sh found, skipping sync"
    fi
}

# ============================================================================
# Git Functions
# ============================================================================

git_commit_changes() {
    if [ "$DO_COMMIT" = false ]; then
        log_verbose "Skipping commit (--no-commit)"
        return 0
    fi

    # Check if there are changes to commit
    if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
        log_verbose "No changes to commit"
        return 0
    fi

    log "Committing changes..."
    git add -A

    local commit_msg="[ralph-loop] ${MODE} iteration ${ITERATION}"
    if [ -n "$PROJECT_ID" ]; then
        commit_msg="${commit_msg} (project: ${PROJECT_ID})"
    fi

    git commit -m "$commit_msg" || {
        log_warn "Commit failed or nothing to commit"
        return 0
    }

    log_success "Changes committed"
}

git_push_changes() {
    if [ "$DO_PUSH" = false ]; then
        log_verbose "Skipping push (--no-push)"
        return 0
    fi

    log "Pushing to origin/${BRANCH}..."

    # Try push, if fails try setting upstream
    if ! git push origin "$BRANCH" 2>/dev/null; then
        log_verbose "Setting upstream and pushing..."
        git push -u origin "$BRANCH" 2>/dev/null || {
            log_warn "Push failed - you may need to push manually"
            return 0
        }
    fi

    log_success "Pushed to origin/${BRANCH}"
}

# ============================================================================
# Main Loop
# ============================================================================

ITERATION=0

run_iteration() {
    ITERATION=$((ITERATION + 1))

    echo ""
    log "═══════════════════════════════════════════════════════════════"
    log "ITERATION ${ITERATION} - MODE: ${MODE}"
    log "═══════════════════════════════════════════════════════════════"
    echo ""

    # Sync kanban tasks before iteration
    sync_kanban_tasks

    # Build the prompt with context
    local full_prompt=""

    # Add project context if available
    if [ -n "$PROJECT_ID" ]; then
        full_prompt="VIBE_KANBAN_PROJECT_ID: ${PROJECT_ID}\n\n"
    fi

    # Add iteration context
    full_prompt="${full_prompt}ITERATION: ${ITERATION}\n"
    full_prompt="${full_prompt}MODE: ${MODE}\n\n"

    # Add the main prompt content
    full_prompt="${full_prompt}$(cat "$PROMPT_FILE")"

    # Run Claude
    log "Running Claude (${MODEL})..."
    echo ""

    # Write prompt to temp file for claude to read
    local prompt_file=$(mktemp)
    echo -e "$full_prompt" > "$prompt_file"

    # Build claude args for interactive mode (uses subscription)
    local claude_args=(
        "--dangerously-skip-permissions"
        "--model" "$MODEL"
    )

    if [ "$VERBOSE" = true ]; then
        claude_args+=("--verbose")
    fi

    # Run Claude interactively with the prompt
    # This uses subscription instead of API credits
    claude "${claude_args[@]}" < "$prompt_file"
    local exit_code=$?

    # Cleanup
    rm -f "$prompt_file"

    # Note: Token tracking not available in interactive mode
    # We estimate based on typical usage
    log_verbose "Interactive mode - token tracking estimated"

    echo ""

    if [ $exit_code -ne 0 ]; then
        log_error "Claude exited with code ${exit_code}"
        log_warn "Continuing to next iteration..."
    else
        log_success "Iteration ${ITERATION} completed successfully"
    fi

    # Show token stats
    log_token_stats

    # Save session stats
    save_session_stats

    # Check if we need to re-context
    if should_recontext; then
        log_warn "Approaching token limit (${SESSION_TOKENS}/${TOKEN_LIMIT})"
        log_warn "Triggering re-context (fresh session)..."

        # Reset session counters but keep totals
        SESSION_TOKENS=0
        SESSION_INPUT_TOKENS=0
        SESSION_OUTPUT_TOKENS=0

        # Add marker to plan file that we're continuing from re-context
        if [ -f "${SCRIPT_DIR}/IMPLEMENTATION_PLAN.md" ]; then
            echo -e "\n<!-- Re-context triggered at iteration ${ITERATION} -->" >> "${SCRIPT_DIR}/IMPLEMENTATION_PLAN.md"
        fi

        log "Session reset - continuing with fresh context"
    fi

    # Git operations
    git_commit_changes
    git_push_changes

    return $exit_code
}

# Trap for clean shutdown
cleanup() {
    echo ""
    log "Received interrupt signal"
    log "Completed ${ITERATION} iteration(s)"
    log_token_stats
    save_session_stats
    exit 0
}

trap cleanup SIGINT SIGTERM

# Main execution
log "Starting Ralph Loop..."
echo ""

while true; do
    run_iteration || true  # Continue even on errors

    # Check iteration limit
    if [ "$MAX_ITERATIONS" -gt 0 ] && [ "$ITERATION" -ge "$MAX_ITERATIONS" ]; then
        log "Reached maximum iterations (${MAX_ITERATIONS})"
        break
    fi

    # Small delay between iterations to prevent runaway
    sleep 2
done

echo ""
log_success "Ralph Loop completed"
log "Total iterations: ${ITERATION}"
log_token_stats
save_session_stats
log "Session stats saved to: ${SESSION_FILE}"

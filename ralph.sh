#!/bin/bash
# Ralph Loop Runner for Prophecy News Vercel Dashboard - Archive Page
# Location: /home/dosubuntu/clawd/projects/prophecy-news-vercel/ralph.sh

set -e

PROJECT_DIR="/home/dosubuntu/clawd/projects/prophecy-news-vercel"
PROMPT_FILE="$PROJECT_DIR/prompts/archive-implement.md"
PLAN_FILE="$PROJECT_DIR/specs/implementation-plans/archive-page.md"

echo "🚀 Starting Ralph Loop for Archive Page Feature"
echo "=============================================="

ITERATION=1
MAX_ITERATIONS=10

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    echo ""
    echo "--- Iteration $ITERATION ---"
    
    # Check if all tasks are complete
    if grep -q "\[ \]" "$PLAN_FILE" 2>/dev/null; then
        echo "Tasks remaining. Spawning fresh session..."
    else
        echo "All tasks complete!"
        echo ""
        echo "✅ Ralph Loop complete! Archive page feature implemented."
        echo ""
        echo "Next steps:"
        echo "1. cd $PROJECT_DIR"
        echo "2. Review the created files (api/archive.js, pages/archive.js)"
        echo "3. git add . && git commit -m 'feat: add archive page'"
        echo "4. git push"
        echo "5. Vercel will auto-deploy"
        break
    fi
    
    # Spawn fresh session with the implementation prompt
    echo "Running iteration $ITERATION..."
    
    # Use sessions_spawn to run the implementation
    openclaw sessions spawn \
        --runtime subagent \
        --task "$(cat "$PROMPT_FILE")" \
        --label "ralph-archive-$ITERATION" \
        --runTimeoutSeconds 600
    
    echo "Iteration $ITERATION complete."
    
    # For attended mode, exit after one iteration
    # Remove this break for unattended mode
    break
    
done

if [ $ITERATION -gt $MAX_ITERATIONS ]; then
    echo "Max iterations reached. Review progress and continue manually."
fi

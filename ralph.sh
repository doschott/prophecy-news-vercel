#!/bin/bash
# Ralph Loop Runner for Prophecy News Vercel Dashboard
# Location: /home/dosubuntu/clawd/projects/prophecy-news-vercel/ralph.sh

set -e

PROJECT_DIR="/home/dosubuntu/clawd/projects/prophecy-news-vercel"
PROMPT_FILE="$PROJECT_DIR/prompts/implement.md"
PLAN_FILE="$PROJECT_DIR/specs/implementation-plans/videos-page.md"

echo "🚀 Starting Ralph Loop for Prophecy News Vercel Dashboard"
echo "=========================================================="

ITERATION=1
MAX_ITERATIONS=10

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    echo ""
    echo "--- Iteration $ITERATION ---"
    
    # Check if all tasks are complete
    if grep -q "\[ \]" "$PLAN_FILE"; then
        echo "Tasks remaining. Spawning fresh session..."
    else
        echo "All tasks complete!"
        echo ""
        echo "✅ Ralph Loop complete! Check $PROJECT_DIR for results."
        echo ""
        echo "Next steps:"
        echo "1. cd $PROJECT_DIR"
        echo "2. Review the created files"
        echo "3. Push to GitHub and connect to Vercel"
        break
    fi
    
    # Spawn fresh session with the implementation prompt
    echo "Running iteration $ITERATION..."
    
    # Read the prompt and send it to a fresh session
    PROMPT=$(cat "$PROMPT_FILE")
    
    # Use sessions_spawn to run the implementation
    openclaw sessions spawn \
        --runtime subagent \
        --task "$PROMPT" \
        --label "ralph-vercel-$ITERATION" \
        --runTimeoutSeconds 300
    
    echo "Iteration $ITERATION complete. Check output above."
    echo "Re-run this script to continue: ./ralph.sh"
    
    break  # Exit after one iteration for attended mode
    
done

if [ $ITERATION -gt $MAX_ITERATIONS ]; then
    echo "Max iterations reached. Review progress and continue manually."
fi

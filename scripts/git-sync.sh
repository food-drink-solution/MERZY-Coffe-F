#!/bin/sh
# Lightweight git auto-sync watcher.
# Polls origin/<SYNC_BRANCH> for new commits and merges them into the
# current working branch so the Angular dev server's HMR picks them up.

set -e

git config --global --add safe.directory /app

BRANCH="${SYNC_BRANCH:-main}"
INTERVAL="${SYNC_INTERVAL:-20}"

echo "[git-sync] Watching origin/$BRANCH for new commits (every ${INTERVAL}s)..."

while true; do
  if git fetch origin "$BRANCH" >/dev/null 2>&1; then
    COUNT=$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo "0")
    if [ "$COUNT" -gt 0 ]; then
      echo "[git-sync] Detected $COUNT new commit(s) on origin/$BRANCH — merging..."

      # Stash any local uncommitted changes (e.g. during an active Base44 turn)
      STASHED=0
      if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
        git stash >/dev/null 2>&1 && STASHED=1
      fi

      # Merge the latest from the watched branch
      if git merge "origin/$BRANCH" --no-edit >/dev/null 2>&1; then
        echo "[git-sync] Merged $COUNT commit(s) from origin/$BRANCH"
      else
        git merge --abort 2>/dev/null || true
        echo "[git-sync] Merge conflict — skipped (resolve manually or push again)"
      fi

      # Restore stashed changes
      if [ "$STASHED" -eq 1 ]; then
        git stash pop >/dev/null 2>&1 || true
      fi
    fi
  fi

  sleep "$INTERVAL"
done

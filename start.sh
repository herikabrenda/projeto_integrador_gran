#!/usr/bin/env bash
set -e

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

npm --prefix backend start &
BACKEND_PID=$!

npm --prefix frontend run dev
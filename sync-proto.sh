#!/bin/bash
# 1. Sync Rust (Commons)
echo "Generating Rust types..."
cd commons && cargo build && cd ..

# 2. Sync TypeScript (Desktop)
echo "Generating TypeScript types..."
cd symphony-desktop && pnpm proto:gen && cd ..

echo "All types synchronized"

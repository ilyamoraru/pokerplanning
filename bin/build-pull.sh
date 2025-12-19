#!/bin/sh
git pull \
  && docker pull ghcr.io/eugene-khorev/pokerplanning:latest \
  && docker compose up -d

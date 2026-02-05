#!/bin/sh
git pull \
  && docker pull ghcr.io/ilyamoraru/pokerplanning:latest \
  && docker compose up -d

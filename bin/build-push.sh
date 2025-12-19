#!/bin/sh
git push \
  && docker build -t ghcr.io/eugene-khorev/pokerplanning:latest . \
  && docker push ghcr.io/eugene-khorev/pokerplanning:latest

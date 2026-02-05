#!/bin/sh
git push \
  && docker build -t ghcr.io/ilyamoraru/pokerplanning:latest . \
  && docker push ghcr.io/ilyamoraru/pokerplanning:latest

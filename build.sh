#!/bin/bash

GIT_HASH=`git rev-parse --short HEAD`

VITE_GIT_HASH=${GIT_HASH} quasar build

#!/bin/sh

# install modules
npm install
if [ ! $? -eq 0 ]; then
  echo "'npm install' failed"
  exit 1
fi

# build client
ng build --prod
if [ ! $? -eq 0 ]; then
  echo "'ng build' failed"
  exit 1
fi

# build docker image
docker build .
if [ ! $? -eq 0 ]; then
  echo "'docker build' failed"
  exit 1
fi

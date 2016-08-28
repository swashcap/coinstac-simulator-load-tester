#!/bin/bash

for CLIENT_COUNT in 10 20 30 40 50 60 70 80 90 100
do
  for ITERATION_COUNT in 10 20 30 40 50 60 70 80 90 100
  do
    node index.js -c $CLIENT_COUNT -i $ITERATION_COUNT
  done
done


#!/bin/bash

for CLIENT_COUNT in 5 10 15 20 25 30 35 40 45 50
do
  for ITERATION_COUNT in 5 10 15 20 25 30 35 40 45 50
  do
    node src/index.js -c $CLIENT_COUNT -i $ITERATION_COUNT
  done
done


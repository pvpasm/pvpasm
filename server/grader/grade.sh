#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    lseccomp="-lseccomp"
else
    lseccomp=""
fi

cd $1

if gcc grader.c solution.c chall.o -o grader $lseccomp -fno-asm 2> log.txt; then
    rm log.txt
    ./grader
fi
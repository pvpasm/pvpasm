#!/bin/sh

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    lseccomp="-lseccomp"
else
    lseccomp=""
fi

cd $1

gcc grader.c solution.c challenge.o -o grader $lseccomp -fno-asm
./grader
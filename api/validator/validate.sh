#!/bin/sh
clang -g -c -emit-llvm -o chall.bc chall.c
clang -g -c -emit-llvm -o submission.bc submission.c
./saw validate.saw
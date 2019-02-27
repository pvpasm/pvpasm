#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    arch="elf64"
else
    arch="macho64"
fi

dirname=$1_`date +%s`

mkdir $dirname
cd $dirname

cp ../template/grader.c .

echo "global _chall" > $3.s
echo "section .text" >> $3.s
echo "_chall:" >> $3.s
cat ../../challenges/$2/$3.s >> $3.s

nasm -f $arch $3.s -o challenge.o

echo $dirname
#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    arch="elf64"
    chall="chall"
else
    arch="macho64"
    chall="_chall"
fi

dirname=$1_`date +%s`

mkdir $dirname
cd $dirname

cp ../template/grader.c .

func=`cat ../../challenges/$2/$3/chall.f`
IFS=$'\n' types=( $func )

echo ${types[0]} 'f('${types[1]}');' >> chall.h
echo ${types[0]} 'chall('${types[1]}');' >> chall.h

echo global $chall > chall.s
echo "section .text" >> chall.s
echo $chall >> chall.s
cat ../../challenges/$2/$3/chall.s >> chall.s

nasm -f $arch chall.s -o chall.o

echo $dirname
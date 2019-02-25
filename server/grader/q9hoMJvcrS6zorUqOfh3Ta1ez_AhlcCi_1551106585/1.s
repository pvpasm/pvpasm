global _chall

section .text
_chall:
    xor rax, rax;
    add rax, 1;
    add rax, rdi;
    ret;
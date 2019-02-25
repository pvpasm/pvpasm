#include <time.h>
#include <stdlib.h>

// only seccomp if on production server
#ifdef linux
#include <seccomp.h>
#endif

extern int chall(int a);
extern int f(int a);

int main() {
    #ifdef linux
    scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_KILL);
 
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(read), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(write), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(sigreturn), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit_group), 0);

    seccomp_load(ctx);
    #endif

    srand(time(NULL));

    for (int i = 0; i < 30000; ++i) {
        int r = rand();

        if (chall(r) != f(r)) {
            return 1;
        }
    }

    return 0;
}
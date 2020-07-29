int foo(int x)
{
    for (int i = 0; i < 10; ++i) {
        x += 2;
    }
    if (x > 10)
        return x + 1;
    return x - 1;
}
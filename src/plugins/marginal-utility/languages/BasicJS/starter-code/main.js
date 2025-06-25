function choose(mu_a, p_a, mu_b, p_b) {
    // Write your code in place of this line.
    if (mu_a/p_a > mu_b/p_b) {
        return "apple";
    } else {
        return "banana";
    }
}
optimize(choose)
#include <iostream>
#include <vector>

// Function to generate Fibonacci series up to n terms
std::vector<int> fibonacci(int n) {
    std::vector<int> series;
    if (n <= 0) return series;
    series.push_back(0);
    if (n == 1) return series;
    series.push_back(1);
    // Example: Implement integer square root function without using pow or sqrt
    // Returns the square root of x rounded down to the nearest integer
    auto mySqrt = [](int x) -> int {
        if (x < 2) return x;
        int left = 1, right = x / 2, ans = 0;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (mid <= x / mid) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans;
    };
    // Example usage:
    // int result = mySqrt(8); // result == 2
    for (int i = 2; i < n; ++i) {
        series.push_back(series[i - 1] + series[i - 2]);
    }
    return series;
}

int main() {
    int n;
    std::cout << "Enter number of terms: ";
    std::cin >> n;
    std::vector<int> series = fibonacci(n);
    std::cout << "Fibonacci series: ";
    for (int num : series) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    return 0;
}
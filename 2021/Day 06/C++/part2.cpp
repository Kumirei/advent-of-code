// Headers
#include <array>
#include <fstream>
#include <iostream>

// Namespaces
using namespace std;  // Bad practice, I know

// Prototypes
template <typename T, size_t N>
T shiftArrayLeft(array<T, N> &v);

// Constants
const int numberOfDays = 256;

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    uint64_t age;
    array<uint64_t, 9> ages = {0, 0, 0, 0, 0, 0, 0, 0, 0};  // Age buckets
    while (file >> age) {
        ages[age]++;
        file.ignore();
    }

    // Run simulation
    for (int i = 0; i < numberOfDays; i++) {
        ages[8] = shiftArrayLeft(ages);
        ages[6] += ages[8];
    }

    // Count fishies
    uint64_t fish = 0;
    for (auto num : ages) fish += num;

    cout << fish << " fishies after " << numberOfDays << " days " << endl;
    // cout << numeric_limits<__uint128_t>::max() << endl;

    return 0;
}

template <typename T, size_t N>
T shiftArrayLeft(array<T, N> &v) {
    const uint64_t first = v[0];
    for (size_t i = 0; i < N - 1; i++) {
        v[i] = v[i + 1];
    }
    return first;
}
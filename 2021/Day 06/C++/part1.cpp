// Headers
#include <algorithm>
#include <array>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know

// Prototypes
template <typename T, size_t N>
T shiftArrayLeft(array<T, N> &v);

// Constants
const int numberOfDays = 80;

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    int age;
    array<int, 9> ages = {0, 0, 0, 0, 0, 0, 0, 0, 0};  // Age buckets
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
    int fish = 0;
    for (auto num : ages) fish += num;
    cout << fish << " fishies after " << numberOfDays << " days " << endl;

    return 0;
}

template <typename T, size_t N>
T shiftArrayLeft(array<T, N> &v) {
    const int first = v[0];
    for (size_t i = 0; i < N - 1; i++) {
        v[i] = v[i + 1];
    }
    return first;
}
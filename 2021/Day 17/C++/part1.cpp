#include <math.h>

#include <chrono>
#include <fstream>
#include <iostream>
#include <sstream>

// Namespaces
using namespace std;  // Bad practice, I know

struct Target {
    pair<int, int> x;
    pair<int, int> y;
};

// Main
int main() {
    pair<int, int> x;
    pair<int, int> y;

    // Get input
    ifstream file("../data.txt");
    string line;
    getline(file, line);
    stringstream ss{line};
    ss.ignore(99, '=') >> x.first;
    ss.ignore(2) >> x.second;
    ss.ignore(99, '=') >> y.first;
    ss.ignore(2) >> y.second;
    Target target{x, y};

    // Find highest point
    auto start = chrono::high_resolution_clock::now();
    int i = 0;
    int height;
    while (true) {
        height = 0.5 * i * (i - 1);
        double mostSteps = 0.5 * (1 + sqrt(8 * height - 8 * target.y.first + 1));
        if (mostSteps == i + 1) break;
        i++;
    }
    auto stop = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);

    cout << "Highest possible shot: " << height << endl;
    cout << "Time elapsed: " << duration.count() << "us" << endl;

    return 0;
}
// Headers
#include <algorithm>
#include <array>
#include <cmath>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know

// Prototypes

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    vector<int> positions;
    int position;
    while (file >> position) {
        positions.push_back(position);
        file.ignore();
    }

    // Calculate fuel consumption
    double average = 0;
    for (double pos : positions) average += pos / positions.size();
    const int targets[] = {int(floor(average)), int(floor(average)) + 1};
    int fuel = numeric_limits<int>::max();
    for (int target : targets) {
        int newFuel = 0;
        for (int pos : positions) newFuel += abs(pos - target) * (abs(pos - target) + 1) / 2;
        if (newFuel < fuel) fuel = newFuel;
    }

    // Output result
    cout << "Fuel consumption: " << fuel << endl;

    return 0;
}
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
    int fuel = numeric_limits<int>::max();
    for (int i = 0; true; i++) {
        int newFuel = 0;
        for (int pos : positions) newFuel += abs(pos - i);
        if (newFuel > fuel) break;
        fuel = newFuel;
    }

    // Output result
    cout << "Fuel consumption: " << fuel << endl;

    return 0;
}


// Headers
#include <array>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    vector<string> lines;
    string line;
    while (getline(file, line)) lines.push_back(line);

    // Find risk level
    vector<int> riskLevels;
    for (size_t y = 0; y < lines.size(); y++) {
        const string line = lines[y];
        for (size_t x = 0; x < line.size(); x++) {
            const char n = line[x];
            if ((y == 0 || lines[y - 1][x] > n) && (y == lines.size() - 1 || lines[y + 1][x] > n) &&
                (x == 0 || lines[y][x - 1] > n) && (x == line.size() - 1 || lines[y][x + 1] > n)) {
                riskLevels.push_back(n - 48 + 1);  // 0 is char 48
            }
        }
    }

    // Calculate sum
    int sum = 0;
    for (auto risk : riskLevels) sum += risk;
    cout << "Risk: " << sum << endl;

    return 0;
}

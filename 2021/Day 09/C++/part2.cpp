

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

// Functions
int exploreBasin(vector<string> lines, int x, int y, map<array<int, 2>, bool> &basin) {
    // Return if cell does not exist, it is valued '9', or already visited
    const bool exists = !(y < 0 || size_t(y) >= lines.size() || x < 0 || size_t(x) >= lines[y].size());
    const bool isNine = exists && lines[y][x] == '9';
    const bool inBasin = exists && basin.count({x, y});
    if (!exists || isNine || inBasin) return 0;

    // Add current cell to basin
    basin[{x, y}] = true;

    // Explore nearby cells
    int surr[4][2] = {{x, y - 1}, {x, y + 1}, {x - 1, y}, {x + 1, y}};
    int newCells = 1;
    for (auto coord : surr) {
        newCells += exploreBasin(lines, coord[0], coord[1], basin);
    }
    return newCells;
}
int exploreBasin(vector<string> lines, int x, int y) {
    map<array<int, 2>, bool> basin = {};
    return exploreBasin(lines, x, y, basin);
}

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    vector<string> lines;
    string line;
    while (getline(file, line)) lines.push_back(line);

    // Find basis and their sizes
    vector<int> basinSizes;
    for (size_t y = 0; y < lines.size(); y++) {
        const string line = lines[y];
        for (size_t x = 0; x < line.size(); x++) {
            const char n = line[x];
            if ((y == 0 || lines[y - 1][x] > n) && (y == lines.size() - 1 || lines[y + 1][x] > n) &&
                (x == 0 || lines[y][x - 1] > n) && (x == line.size() - 1 || lines[y][x + 1] > n)) {
                basinSizes.push_back(exploreBasin(lines, x, y));
            }
        }
    }

    // Get product of highest three values
    sort(basinSizes.begin(), basinSizes.end(), greater<int>());
    int product = 1;
    for (int i = 0; i < 3; i++) product *= basinSizes[i];
    cout << "Product: " << product << endl;

    return 0;
}

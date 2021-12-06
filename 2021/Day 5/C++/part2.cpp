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
template <typename T>
int sign(T val);

// Classes
class Line {
   public:
    array<array<int, 2>, 2> points;

    // Accept input from ifstream
    friend ifstream &operator>>(ifstream &ifstream, Line &line) {
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                int number;
                if (ifstream >> number) {
                    line.points[i][j] = number;
                    ifstream.ignore();
                } else
                    return ifstream;
            }
            if (i == 0) ifstream.ignore(99, '>');
        }
        return ifstream;
    }
};

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    // Read in lines
    vector<Line> lines;
    Line line;
    while (file >> line) {
        lines.push_back(line);
    }
    lines.push_back(line);

    // Put line points into a map
    map<int, map<int, int>> traces;
    for (Line line : lines) {
        // Get start position and direction of travel
        array<int, 2> start = line.points[0];
        array<int, 2> end = line.points[1];
        int x = start[0], y = start[1];
        int dx = sign(end[0] - x), dy = sign(end[1] - y);

        // Map points
        while (!(x == end[0] + dx && y == end[1] + dy)) {
            if (!traces.count(y)) traces.insert(pair<int, map<int, int>>(y, {}));
            if (!traces[y].count(x)) traces[y].insert(pair<int, int>(x, 0));
            traces[y][x]++;

            // If end is reached for either coordinate, stop in/de-crementing
            if (x == end[0]) dx = 0;
            if (y == end[1]) dy = 0;
            x += dx;
            y += dy;
        }
    }

    // Count values of 2 or greater in map
    int count = 0;
    for (auto y = traces.begin(); y != traces.end(); ++y) {
        for (auto x : y->second)
            if (x.second > 1) count++;
    }
    cout << "Total intersections: " << count << endl;
    return 0;
}

// ------------------------------------------------------------
// Utility functions
// ------------------------------------------------------------

template <typename T>
int sign(T val) {
    return (T(0) < val) - (val < T(0));
}
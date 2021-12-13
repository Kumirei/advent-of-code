#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know

inline istream& operator>>(istream& is, const char* checkstr);

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    map<pair<int, int>, bool> paper = {};
    vector<pair<char, int>> folds;
    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        istringstream is(line);
        if (line[0] == 'f') {
            pair<char, int> p;
            is >> "fold along " >> p.first >> "=" >> p.second;
            folds.push_back(p);
        } else {
            pair<int, int> p;
            is >> p.first >> "," >> p.second;
            paper[p] = true;
        }
    }

    // Fold paper
    for (size_t i = 0; i < folds.size(); i++) {
        char axis = folds[i].first;
        int index = folds[i].second;
        for (auto it = paper.cbegin(); it != paper.cend();) {
            auto dot = it->first;
            if (axis == 'y' && dot.second > index) {
                if (dot.second > index) {
                    pair<int, int> p = {dot.first, 2 * index - int(dot.second)};
                    paper[p] = true;         // Mirror dot
                    it = paper.erase(it++);  // Delete dot
                    continue;
                }
            } else if (axis == 'x' && dot.first > index) {
                pair<int, int> p = {2 * index - dot.first, dot.second};
                paper[p] = true;         // Mirror dot
                it = paper.erase(it++);  // Delete dot
                continue;
            }
            ++it;
        }
    }

    // Print dots
    int xmax = 0, ymax = 0;
    for (auto dotPair : paper) {
        if (dotPair.first.first > xmax) xmax = dotPair.first.first;
        if (dotPair.first.second > ymax) ymax = dotPair.first.second;
    }
    for (int y = 0; y <= ymax; y++) {
        for (int x = 0; x <= xmax; x++) {
            if (paper.count(pair<int, int>{x, y}))
                cout << '#';
            else
                cout << ' ';
        }
        cout << endl;
    }
    return 0;
}

// read a delimiter that must match a certain string
// eg: is >> x >> "," >> y;
inline istream& operator>>(istream& is, const char* checkstr) {
    // skip ws at the start of checkstr
    const char* currcheck = checkstr;
    while (isspace(*currcheck)) ++currcheck;

    // skip ws at start of istream
    while (isspace(is.peek())) is.get();

    // go through checkstr char by char and ensure we get matching data out of is
    while (*currcheck) {
        is.get();
        ++currcheck;
    }

    return is;
}
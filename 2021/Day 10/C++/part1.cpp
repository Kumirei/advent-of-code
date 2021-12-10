

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

// Main
int main() {
    const string openBrackets = "([{<";

    // Get input
    ifstream file("../data.txt");
    vector<string> lines;
    string line;
    while (getline(file, line)) lines.push_back(line);

    // Find illegal characters
    map<char, char> bracketMap = {
        {')', '('},
        {']', '['},
        {'}', '{'},
        {'>', '<'},
    };
    vector<char> opens;
    vector<char> illegals;
    for (string line : lines) {
        for (char c : line) {
            if (openBrackets.find(c) != string::npos)
                opens.push_back(c);
            else if (bracketMap[c] == opens.back())
                opens.pop_back();
            else {
                illegals.push_back(c);
                break;
            }
        }
    }

    // Calculate points
    map<char, int> scoringTable = {{')', 3}, {'}', 1197}, {']', 57}, {'>', 25137}};
    int score = 0;
    for (auto c : illegals) score += scoringTable[c];
    cout << "Score: " << score << endl;

    return 0;
}

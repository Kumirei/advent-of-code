

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

    map<char, char> bracketMap = {
        {')', '('},
        {']', '['},
        {'}', '{'},
        {'>', '<'},
    };

    // Find legal lines
    vector<char> opens;
    vector<string> legalLines;
    for (string line : lines) {
        for (char c : line) {
            if (openBrackets.find(c) != string::npos)
                opens.push_back(c);
            else if (bracketMap[c] == opens.back())
                opens.pop_back();
            else
                goto nextLine;
        }
        legalLines.push_back(line);
    nextLine:;
    }

    // Loop over legal lines to find closing sequences and their score
    map<char, int> scoringTable = {{'(', 1}, {'[', 2}, {'{', 3}, {'<', 4}};
    vector<uint64_t> scores;
    for (string line : legalLines) {
        // Find closing sequence
        vector<char> opens;
        for (char c : line) {
            if (openBrackets.find(c) != string::npos)
                opens.push_back(c);
            else if (bracketMap[c] == opens.back())
                opens.pop_back();
        }
        // Calculate sequence score
        uint64_t score = 0;
        while (opens.size() > 0) {
            score = score * 5 + scoringTable[opens.back()];
            opens.pop_back();
        }
        scores.push_back(score);
    }

    // Calculate points
    sort(scores.begin(), scores.end(), greater<uint64_t>());
    const uint64_t score = scores[(scores.size() - 1) / 2];
    cout << "Score: " << score << endl;

    return 0;
}

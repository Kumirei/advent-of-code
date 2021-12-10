

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
    vector<vector<string>> lines;
    string strLine;
    while (getline(file, strLine)) {
        vector<string> line;
        stringstream ss{strLine};
        string word;
        while (ss >> word)
            if (word != "|") line.push_back(word);
        lines.push_back(line);
    }

    // Count
    int count = 0;
    for (auto line : lines) {
        for (int i = 10; i < 14; i++) {
            if (line[i].size() <= 4 || line[i].size() == 7) count++;
        }
    }

    cout << "Count: " << count << endl;

    return 0;
}

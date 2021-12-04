#include <math.h>

#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <typeinfo>
#include <vector>

using namespace std;
vector<string> fileToVector(ifstream &);
vector<string> splitString(string s, string del = " ");

int main() {
    // Get data
    ifstream file("../data.txt");
    vector<string> data = fileToVector(file);

    // Prepare counting array
    array<int, 12> counts;
    counts.fill(0);

    // Count occurances
    for (int i = 0; i < data.size(); i++) {
        string line = data[i];
        for (int j = 0; j < line.size(); j++) {
            int digit = line[j] - 48;  // 48=0 and 49=1
            counts[j] += digit > 0 ? 1 : -1;
        }
    }

    // Calculate results
    int gamma = 0, epsilon = 0;
    for (int i = 0; i < 12; i++) {
        counts[i] = counts[i] > 0 ? 1 : 0;
        gamma += pow(counts[i] * 2, 12 - 1 - i);
    }
    for (auto c : counts) cout << c;
    cout << endl;
    cout << gamma << endl;
    epsilon = pow(2, 12) - 1 - gamma;
    cout << "Power: " << gamma * epsilon << endl;

    return 0;
}

// Reads file contents into vector of strings
vector<string> fileToVector(ifstream &file) {
    vector<string> v;
    if (file.is_open()) {
        string line;
        while (file.good()) {
            getline(file, line);
            v.push_back(line);
        }
    } else {
        cout << "Could not open file." << endl;
    }
    return v;
}

// Split string into vector
vector<string> splitString(string s, string del) {
    vector<string> strings;
    int start = 0;
    int end = s.find(del);
    while (end != -1) {
        strings.push_back(s.substr(start, end - start));
        start = end + del.size();
        end = s.find(del, start);
    }
    strings.push_back(s.substr(start, end - start));
    return strings;
}
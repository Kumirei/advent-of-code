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
int binaryToDecimal(string bin);
array<int, 12> mostFrequent(vector<string> data, int eq);

int main() {
    // Get data
    ifstream file("../data.txt");
    vector<string> data = fileToVector(file);

    // Get most frequent bit
    array<int, 12> counts = mostFrequent(data, 1);

    // Filter data for conditions
    int oxygen, scrubber;
    // Oxygen
    vector<string> remaining = data;
    for (int i = 0; i < 12; i++) {
        array<int, 12> counts = mostFrequent(remaining, 1);
        vector<string> filtered;
        for (int j = 0; j < remaining.size(); j++) {
            int digit = remaining[j][i] - 48;
            if (digit == counts[i]) filtered.push_back(remaining[j]);
        }
        if (filtered.size() == 1) {
            oxygen = binaryToDecimal(filtered[0]);
            break;
        }
        remaining = filtered;
    }
    // Scrubber
    remaining = data;
    for (int i = 0; i < 12; i++) {
        array<int, 12> counts = mostFrequent(remaining, 1);
        vector<string> filtered;
        for (int j = 0; j < remaining.size(); j++) {
            int digit = remaining[j][i] - 48;
            if (digit == (counts[i] == 0 ? 1 : 0)) filtered.push_back(remaining[j]);
        }
        if (filtered.size() == 1) {
            scrubber = binaryToDecimal(filtered[0]);
            // break;
        }
        remaining = filtered;
    }

    // Get result
    cout << "Life support rating: " << oxygen * scrubber << endl;

    return 0;
}

// Count occurances for this specific task
array<int, 12> mostFrequent(vector<string> data, int eq) {
    array<int, 12> counts;
    counts.fill(0);
    for (int i = 0; i < data.size(); i++) {
        string line = data[i];
        for (int j = 0; j < line.size(); j++) {
            int digit = line[j] - 48;  // 48=0 and 49=1
            counts[j] += digit > 0 ? 1 : -1;
        }
    }
    // Reduce to binary
    for (int i = 0; i < 12; i++) {
        counts[i] = counts[i] > 0 ? 1 : (counts[i] == 0 ? eq : 0);
    }
    return counts;
}

// Converts binary string to decimal int
int binaryToDecimal(string bin) {
    int decimal = 0;
    int size = bin.size();
    for (int i = 0; i < size; i++) {
        int digit = bin[i] - 48;
        decimal += digit * pow(digit * 2, size - i - 1);
    }
    return decimal;
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
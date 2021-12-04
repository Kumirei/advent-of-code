#include <fstream>
#include <iostream>
#include <regex>
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

    // Calculate movement
    int x = 0, y = 0;
    for (auto move : data) {
        vector<string> movement = splitString(move);  // [direction, distance]
        string direction = movement[0];
        int distance = stoi(movement[1]);
        if (direction == "forward")
            x += distance;
        else if (direction == "up")
            y -= distance;
        else if (direction == "down")
            y += distance;
    }

    // Find position and answer
    cout << "Position (" << x << ", " << y << ")" << endl;
    cout << "x*y = " << x * y << endl;

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
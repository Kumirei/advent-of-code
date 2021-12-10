#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    // Read data into a vector
    vector<int> numbers;
    ifstream datafile;
    datafile.open("../data.txt");
    if (datafile.is_open()) {
        string line;
        while (datafile.good()) {
            getline(datafile, line);
            numbers.push_back(stoi(line));
        }
    } else {
        cout << "Could not open file." << endl;
    }
    // Iterate over data to find count
    int prev = numbers[0];
    int largerCount = 0;
    for (auto number : numbers) {
        if (number > prev) largerCount++;
        prev = number;
    }
    cout << "Larger count: " << largerCount << endl;
}
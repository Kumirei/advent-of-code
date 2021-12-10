#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    // Read data into vector
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
    // Iterate over data to create sliding window sums
    int sums[numbers.size() - 2];
    for (string::size_type i = 2; i < numbers.size(); i++) {
        sums[i] = numbers[i - 2] + numbers[i - 1] + numbers[i];
    }
    // Iterate over sums to find count
    int prev = sums[0];
    int largerCount = 1;
    for (auto number : sums) {
        if (number > prev) largerCount++;
        prev = number;
    }
    cout << "Larger count: " << largerCount << endl;
}
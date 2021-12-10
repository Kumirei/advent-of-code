// Headers
#include <algorithm>
#include <array>
#include <fstream>
#include <iostream>
#include <sstream>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know

// Prototypes
template <typename T>
bool contains(vector<T> vect, T value);
vector<int> slice(vector<int> v, int start, int end, int step = 1);
template <typename T>
void printVector(vector<T> list, int depth = 1);

// Classes
class BingoCard {
   public:
    array<array<int, 5>, 5> indices;
    array<array<int, 5>, 5> values;

    // Accept input from ifstream >> BingoCard
    friend ifstream &operator>>(ifstream &ifstream, BingoCard &board) {
        for (int y = 0; y < 5; y++) {
            for (int x = 0; x < 5; x++) {
                int number;
                if (ifstream >> number) {
                    board.indices[y][x] = number;
                    board.values[y][x] = number;
                } else {
                    return ifstream;
                }
            }
        }
        return ifstream;
    }

    // Map values to their index in the calling order
    void map_to_call_index(vector<int> calls) {
        for (auto &row : indices) {
            for (auto &cell : row) {
                cell = distance(calls.begin(), find(calls.begin(), calls.end(), cell));
            }
        }
    }

    // Find the lowest call the BingoCard can win on
    // Check rows and column for the highest index in each
    // Return the lowest highest index
    int earliest_win() {
        int lowest_max_index = numeric_limits<int>::max();
        // Check rows
        for (auto row : indices) {
            int max = *max_element(row.begin(), row.end());
            if (max < lowest_max_index) lowest_max_index = max;
        }
        // Check columns
        for (int i = 0; i < 5; i++) {
            int max = -1;
            for (auto row : indices) {
                if (row[i] > max) max = row[i];
            }
            if (max < lowest_max_index) lowest_max_index = max;
        }
        return lowest_max_index;
    }

    // Calculate the score of the card
    int get_score(vector<int> calls) {
        int sum = 0;
        // Go through all numbers and sum the ones that are no in the calls
        for (auto row : values) {
            for (auto cell : row) {
                if (!contains(calls, cell)) sum += cell;
            }
        }
        return sum * calls.back();
    }
};

int main() {
    // Get input
    ifstream file("../data.txt");
    // Read in calls
    vector<int> calls;
    string line;
    getline(file, line);
    stringstream ss{line};
    int number;
    while (ss >> number) {
        calls.push_back(number);
        ss.ignore();
    }
    // Read in boards and process them at the same time
    BingoCard card;
    BingoCard worst_card;
    int slowest_win = -1;
    while (file >> card) {
        card.map_to_call_index(calls);
        int win_index = card.earliest_win();
        if (win_index > slowest_win) {
            slowest_win = win_index;
            worst_card = card;
        }
    }
    cout << "Worst card score: " << worst_card.get_score(slice(calls, 0, slowest_win + 1)) << endl;

    return 0;
}

// Utility functions

// Check if vector contains item
template <typename T>
bool contains(vector<T> vect, T value) {
    return find(vect.begin(), vect.end(), value) != vect.end();
}

// Slice a vector into a subset
vector<int> slice(vector<int> v, int start, int end, int step) {
    vector<int> newVector;
    for (int i = start; i < end; i += step) newVector.push_back(v[i]);
    return newVector;
}

// Print anything
template <typename T>
void print(T item, string end = "\n") {
    cout << item << end;
}

// Print vector
template <typename T>
void printVector(vector<T> list, int depth) {
    for (auto cell : list) {
        if (depth > 1)
            printVector(list, depth - 1);
        else
            print(cell, ", ");
    }
    cout << endl;
}
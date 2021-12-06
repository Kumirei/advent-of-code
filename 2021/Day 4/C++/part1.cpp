// Headers
#include <algorithm>
#include <fstream>
#include <iostream>
#include <list>
#include <regex>
#include <string>
#include <typeinfo>
#include <vector>

// Namespaces
using namespace std;  // Bad practice, I know, but I am new to C++

// Types
typedef vector<string> stringList;
typedef vector<int> intList;
typedef vector<intList> board;
typedef string::size_type sizeInt;

// Prototypes in no particular order
vector<string> readLines(string path);
vector<string> split(string s, string del = ",");
stringList split(string s, regex del);
intList toIntList(stringList list);
void print(string);
void print(stringList list, string del = ", ");
void print(intList list, string del = ", ");
void print(vector<intList> list, string del = ", ");
string readTextFile(string path);
inline string& trim(string& s, const char* t = " \t\n\r\f\v");
vector<int> slice(vector<int> v, int start, int end, int step = 1);
bool contains(intList v, int val);

// Classes
class bingoCard {
   public:
    bool solved = false;
    board rows;
    bingoCard(board r) { rows = r; }
    bool solve(intList called) {
        for (sizeInt i = 0; i < rows.size(); i++) {
            bool rowSolved = checkRow(called, rows[i]);
            intList column;
            for (intList row : rows) column.push_back(row[i]);
            bool colSolved = checkRow(called, column);
            if (rowSolved || colSolved) {
                solved = true;
                return true;
            }
        }
        return false;
    }
    // Check if row is solved or not
    bool checkRow(intList called, intList row) {
        for (int num : row) {
            if (!contains(called, num)) return false;
        }
        return true;
    }
    int calculateScore(intList called) {
        int sum = 0;
        for (intList row : rows) {
            for (int num : row) {
                if (!contains(called, num)) sum += num;
            }
        }
        return sum * called.back();
    }
};

// Main!
int main() {
    // Get numbers to call
    stringList numberData = readLines("../test-data-numbers.txt");
    stringList dataList = split(numberData[0], ",");
    intList numbers = toIntList(dataList);

    // Get boards
    string data = readTextFile("../test-data-boards.txt");
    dataList = split(data, "\n\n");
    vector<bingoCard> boards;
    for (string b : dataList) {
        stringList rows = split(b, "\n");
        board newBoard;
        for (string row : rows) {
            newBoard.push_back(toIntList(split(row, regex{"\\s+"})));
        }
        boards.push_back(bingoCard(newBoard));
    }

    // Start calling numbers
    for (sizeInt i = 1; i < numbers.size(); i++) {
        intList called = slice(numbers, 0, i);
        for (bingoCard b : boards) {
            b.solve(called);
            if (b.solved) {
                cout << "Solution found" << endl;
                cout << "Score: " << b.calculateScore(called) << endl;
                goto solutionFound;
            }
        }
    }
solutionFound:

    return 0;
}

// ----------------------------------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------------------------------------------

// Check if vector includes value
bool contains(intList v, int val) { return find(v.begin(), v.end(), val) != v.end(); }

// Slice a vector into a subset
vector<int> slice(vector<int> v, int start, int end, int step) {
    intList newVector;
    for (int i = start; i < end; i += step) {
        newVector.push_back(v[i]);
    }
    return newVector;
}

// Print something
void print(string s) { cout << s << endl; }

// Prints a list
void print(stringList list, string del) {
    for (auto cell : list) cout << cell << del;
    cout << endl;
}
void print(intList list, string del) {
    for (auto cell : list) cout << cell << del;
    cout << endl;
}
void print(vector<intList> list, string del) {
    for (auto cell : list) {
        print(cell, del);
    }
    cout << endl;
}

// Convert stringlist to intlist
intList toIntList(stringList list) {
    intList newList;
    for (sizeInt i = 0; i < list.size(); i++) {
        string trimmed = trim(list[i]);
        if (trimmed.size() > 0) {
            newList.push_back(stoi(trim(list[i])));
        }
    }
    return newList;
}

// Read text file to single string
// Taken from https://stackoverflow.com/a/116220
string readTextFile(string path) {
    ifstream file(path);
    std::ostringstream sstr;
    sstr << file.rdbuf();
    return sstr.str();
}

// Reads file contents into vector of strings
stringList readLines(string path) {
    ifstream file(path);
    stringList v;
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
stringList split(string s, string del) {
    stringList strings;
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

// Split string into vector
// Taken from https://stackoverflow.com/a/39359208
stringList split(string s, regex del) {
    stringList strings;
    regex_token_iterator<string::iterator> i(s.begin(), s.end(), del, -1);
    regex_token_iterator<string::iterator> end;
    while (i != end) strings.push_back(*i++);
    return strings;
}

// ----------------------------------------------------------------------------------------------------
// Taken from https://stackoverflow.com/a/25829233

// trim from left
inline string& ltrim(string& s, const char* t = " \t\n\r\f\v") {
    s.erase(0, s.find_first_not_of(t));
    return s;
}

// trim from right
inline string& rtrim(string& s, const char* t = " \t\n\r\f\v") {
    s.erase(s.find_last_not_of(t) + 1);
    return s;
}

// trim from left & right
inline string& trim(string& s, const char* t) { return ltrim(rtrim(s, t), t); }
// ----------------------------------------------------------------------------------------------------
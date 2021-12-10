

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

// Utility functions
// Invert a map
template <typename T, typename Y>
map<Y, T> invertMap(map<T, Y> m) {
    map<Y, T> inverse;
    for (typename map<T, Y>::iterator i = m.begin(); i != m.end(); ++i) inverse[i->second] = i->first;
    return inverse;
}

// Remove characters from a string
string removeCharsInString(string str, const string &c) {
    for (unsigned int i = 0; i < c.length(); ++i) {
        str.erase(remove(str.begin(), str.end(), c.at(i)), str.end());
    }
    return str;
}

// Constants
const string chars = "abcdefg";
const vector<string> numbers = {"abcefg", "cf",     "acdeg", "acdfg",   "bcdf",
                                "abdfg",  "abdefg", "acf",   "abcdefg", "abcdfg"};

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

    // Solve line by line
    vector<int> values;
    for (auto line : lines) {
        // Count the number of times each segment appears in the list of numbers 0-9
        map<char, int> charCount = {{'a', 0}, {'b', 0}, {'c', 0}, {'d', 0}, {'e', 0}, {'f', 0}, {'g', 0}};
        map<int, string> lengths;
        for (int i = 0; i < 10; i++) {
            stringstream ss{line[i]};
            char c;
            while (ss >> c) charCount[c]++;
            lengths[line[i].size()] = line[i];
        }
        // Create a key containing the translation
        map<char, char> key;
        // Deduce from counts and numbers which character corresponds to each segment
        map<int, char> countChar = invertMap(charCount);
        key['b'] = countChar[6];                                          // B is the only one with count 6
        key['e'] = countChar[4];                                          // E is the only one with count 4
        key['f'] = countChar[9];                                          // F is the only one with count 9
        key['c'] = removeCharsInString(lengths[2], string{key['f']})[0];  // 1 consists of C and F, we know F
        key['a'] = removeCharsInString(lengths[3],
                                       string{key['f']} + string{key['c']})[0];  // 7 consists of 1 and A, we know 1
        key['d'] = removeCharsInString(
            lengths[4], string{key['f']} + string{key['c']} + string{key['b']})[0];  // 4 consists of 1 and B, we know B
        // Invert key for translation
        key = invertMap(key);
        for (char c : chars)
            if (!key.count(c)) key[c] = 'g';  // Get last segment
        // for (auto x : key) cout << x.first << " " << x.second << endl;

        // Translate
        string digits = "";
        for (int i = 10; i < 14; i++) {
            string word = line[i];
            stringstream ss{word};
            string translatedWord;
            char c;
            while (ss >> c) translatedWord += key[c];
            sort(translatedWord.begin(), translatedWord.end());
            digits += to_string(distance(numbers.begin(), find(numbers.begin(), numbers.end(), translatedWord)));
        }
        values.push_back(stoi(digits));
    }

    // Sum values
    int sum = 0;
    for (auto val : values) sum += val;
    cout << "Sum: " << sum << endl;

    return 0;
}
#include <math.h>

#include <fstream>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <typeinfo>
#include <vector>

using namespace std;

int main() {
    // Get data
    ifstream numbers("../test-data-numbers.txt");

    // Get numbers into array
    cout << numbers << endl;

    return 0;
}

#include <fstream>
#include <iostream>

// Namespaces
using namespace std;  // Bad practice, I know

// Constants
const int delta[8][2] = {{-1, -1}, {0, -1}, {1, -1}, {-1, 0}, {1, 0}, {-1, 1}, {0, 1}, {1, 1}};

// Functions
// Flash a single octopus
int flashOctopus(int octopi[10][10], int x, int y) {
    int flashes = 1;
    octopi[y][x] = 0;  // Flash self
    // Flash neighbours
    for (auto d : delta) {
        int x2 = x + d[0], y2 = y + d[1];
        if (x2 < 0 || x2 > 9 || y2 < 0 || y2 > 9) continue;  // Neighbor doesn't exist
        if (octopi[y2][x2] == 0) continue;                   // Neighbour already flashed
        octopi[y2][x2]++;                                    // Increment neighbour
        if (octopi[y2][x2] > 9) flashes += flashOctopus(octopi, x2, y2);
    }
    return flashes;
}

// Flash the octopi like xmas lights
int flash(int octopi[10][10]) {
    int flashes = 0;
    // Flash some octopi
    for (int i = 0; i < 100; i++) {
        if (octopi[i / 10][i % 10] > 9) flashes += flashOctopus(octopi, i % 10, i / 10);
    }
    return flashes;
}

// Main
int main() {
    // Get input
    ifstream file("../data.txt");
    int octopi[10][10];
    char number;
    int i = 0;
    while (file >> number) {
        octopi[i / 10][i % 10] = number - 48;
        i++;
    }

    // Count flashes
    int flashes = 0;
    int steps = 0;
    while (flashes != 100) {
        for (int i = 0; i < 100; i++) octopi[i / 10][i % 10]++;  // increment all
        flashes = flash(octopi);
        steps++;
    }

    // Output result
    cout << "Steps: " << steps << endl;

    return 0;
}
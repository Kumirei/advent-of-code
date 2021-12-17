#include <math.h>

#include <chrono>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>

// Namespaces
using namespace std;  // Bad practice, I know

struct Target {
    pair<int, int> x;
    pair<int, int> y;
};

Target getInput();
int getMaxHeight(Target);
int tryXvals(Target target, double x0, double y0, map<pair<int, int>, bool> found);

// Main
int main() {
    auto start = chrono::high_resolution_clock::now();
    Target target = getInput();

    // Find max y velocity
    int height = getMaxHeight(target);
    double maxStartYvel = ceil(1 / 2 + sqrt(1 / 4 + 2 * height) - 1);
    int count = 0;
    map<pair<int, int>, bool> found = {};
    // Start searching for solutions in x
    double startXvel = ceil(0.5 * (1 + sqrt(1 + 8 * target.x.first)) - 1);
    for (double x0 = startXvel; x0 <= target.x.second; x0++) count += tryXvals(target, x0, maxStartYvel, found);

    auto stop = chrono::high_resolution_clock::now();
    auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);

    cout << "Highest possible shot: " << height << endl;
    cout << "Number of trajectories: " << count << endl;
    cout << "Time elapsed: " << duration.count() << "us" << endl;

    return 0;
}

Target getInput() {
    pair<int, int> x;
    pair<int, int> y;

    // Get input
    ifstream file("../data.txt");
    string line;
    getline(file, line);
    stringstream ss{line};
    ss.ignore(99, '=') >> x.first;
    ss.ignore(2) >> x.second;
    ss.ignore(99, '=') >> y.first;
    ss.ignore(2) >> y.second;
    Target target{x, y};
    return target;
}

int getMaxHeight(Target target) {
    int i = 0;
    int height;
    while (true) {
        height = 0.5 * i * (i - 1);
        double mostSteps = 0.5 * (1 + sqrt(8 * height - 8 * target.y.first + 1));
        if (mostSteps == i + 1) break;
        i++;
    }
    return height;
}

int tryXvals(Target target, double x0, double startY0, map<pair<int, int>, bool> found) {
    int count = 0;
    double t = ceil(0.5 * (1 + 2 * x0) - sqrt(pow((0.5 * (1 + 2 * x0)), 2) - 2 * target.x.first));
    double dx = x0 - t;
    double x = x0 * t - 0.5 * t * (t - 1);
    while (dx >= 0 && x <= target.x.second) {
        if (x <= target.x.second && x >= target.x.first) {
            // x in bounds, find solutions in y
            for (double y0 = startY0; y0 >= target.y.first; y0--) {
                double y = y0 * t - 0.5 * t * (t - 1);
                if (!(y <= target.y.second && y >= target.y.first) && dx == 0) {
                    // Search higher steps
                    double maxStep = 0.5 + y0 + sqrt(0.25 * pow((1 + 2 * y0), 2) - 2 * target.y.first);
                    for (double t2 = t; t2 <= maxStep; t2++) {
                        y = y0 * t2 - 0.5 * t2 * (t2 - 1);
                        if (y <= target.y.second && y >= target.y.first) break;
                    }
                }
                if (y >= target.y.first && y <= target.y.second && !found.count(pair<int, int>{x0, y0})) {
                    count++;
                    found[pair<int, int>{x0, y0}] = true;
                }
            }
        }
        x += dx;
        dx -= 1;
        t++;
    }
    return count;
}
use std::collections::{HashMap, HashSet};

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();

    let mut points = HashSet::new();
    let mut lowest = std::i32::MIN;
    for line in content.lines() {
        let mut pairs: Vec<(i32, i32)> = vec![];
        for part in line.split(" -> ") {
            let (a,b) = part.split_once(',').unwrap();
            let x = a.parse().unwrap();
            let y = b.parse().unwrap();
            if y > lowest {
                lowest = y;
            }
            pairs.push((x,y));
        }

        for i in 0..pairs.len()-1 {
            let (mut x, mut y) = pairs[i];
            let (x1, y1) = pairs[i+1];
            let (dx, dy) = ((x1 - x).signum(), (y1 - y).signum());

            while x != x1 || y != y1 {
                points.insert((x, y));

                x += dx;
                y += dy;
            }
        }
        let (x, y) = pairs.last().unwrap();
        points.insert((*x, *y));
    }

    let mut count = 0;
    'outer: loop {
        let (mut x, mut y) = (500, 0);
        loop {
            if !points.contains(&(x, y+1)) {
                y += 1;
                if y > lowest {
                    break 'outer;
                }
            } else if !points.contains(&(x-1, y+1)) {
                x += -1;
                y += 1;
            } else if !points.contains(&(x+1, y+1)) {
                x += 1;
                y += 1;
            } else {
                count += 1;
                points.insert((x,y));
                break;
            }
        }
    };

    println!("Count: {:?}", count);
}

fn part_2(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();

    let mut points = HashSet::new();
    let mut lowest = std::i32::MIN;
    for line in content.lines() {
        let mut pairs: Vec<(i32, i32)> = vec![];
        for part in line.split(" -> ") {
            let (a,b) = part.split_once(',').unwrap();
            let x = a.parse().unwrap();
            let y = b.parse().unwrap();
            if y > lowest {
                lowest = y;
            }
            pairs.push((x,y));
        }

        for i in 0..pairs.len()-1 {
            let (mut x, mut y) = pairs[i];
            let (x1, y1) = pairs[i+1];
            let (dx, dy) = ((x1 - x).signum(), (y1 - y).signum());

            while x != x1 || y != y1 {
                points.insert((x, y));

                x += dx;
                y += dy;
            }
        }
        let (x, y) = pairs.last().unwrap();
        points.insert((*x, *y));
    }

    let mut count = 0;
    'outer: loop {
        let (mut x, mut y) = (500, 0);
        loop {
            if y == lowest + 1 {
                count += 1;
                points.insert((x,y));
                break;
            }
            if !points.contains(&(x, y+1)) {
                y += 1;
                if y > lowest + 2 {
                    break 'outer;
                }
            } else if !points.contains(&(x-1, y+1)) {
                x += -1;
                y += 1;
            } else if !points.contains(&(x+1, y+1)) {
                x += 1;
                y += 1;
            } else {
                count += 1;
                points.insert((x,y));
                if (x, y) == (500, 0) {
                    break 'outer;
                }
                break;
            }
        }
    };

    println!("Count: {:?}", count);
}

fn main() {
    part_1("input.txt");
    part_2("input.txt");
}
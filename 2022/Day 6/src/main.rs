use std::{fs, collections::HashSet};

fn main() {
    part_1("input1.txt");
    part_2("input1.txt");
}

fn part_1(path: &str) {
    let content = fs::read_to_string(path).expect("Something went wrong reading the file");
    for line in content.lines() {
        let i = process_line(line, 4);
        println!("Part 1: {:?}", i);
    }
}

fn part_2(path: &str) {
    let content = fs::read_to_string(path).expect("Something went wrong reading the file");
    for line in content.lines() {
        let i = process_line(line, 14);
        println!("Part 2: {:?}", i);
    }
}

fn process_line(line: &str, size: usize) -> usize {
    'windows: for window in line.chars().enumerate().collect::<Vec<(usize, char)>>().windows(size) {
        let mut chars = HashSet::new();
        for (i, c) in window {
            if !chars.insert(c) {
                continue 'windows;
            }
        }
        return window.last().unwrap().0 + 1;
    }
    return 0;
}

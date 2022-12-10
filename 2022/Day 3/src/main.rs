use std::fs::File;
use std::io::{self, BufRead};
use std::collections::HashSet;
use std::iter::FromIterator;

#[derive(Debug)]
struct Backpack {
    left: String,
    right: String,
}

impl Backpack {
    fn new(line: &String) -> Backpack {
        let (left, right) = line.split_at(line.len()/2);
        Backpack {
            left: left.to_string(),
            right: right.to_string(),
        }
    }
}

fn main() {
    part_1();
    part_2();
}

fn part_2() {
    let lines = read_lines("input1.txt".to_string());
    let backpacks = lines.iter().map(|line| HashSet::from_iter(line.chars())).collect::<Vec<HashSet<char>>>();

    let mut priorities = 0;
    for chunk in backpacks.chunks(3) {
        let intersection = chunk.iter().fold(chunk[0].clone(), |acc, x| acc.intersection(x).cloned().collect());
        let char = *intersection.iter().next().unwrap() as i32;
        if char < 'a' as i32 {
            priorities += char - 38;
        } else {
            priorities += char - 96;
        }
    }

    println!("Part 2: {}", priorities);
}

fn part_1() {
    let backpacks = parse_input("input1.txt".to_string());
    let mut priorities = 0;
    for backpack in backpacks {
        let items_in_left: HashSet<char> = HashSet::from_iter(backpack.left.chars());
        let items_in_right: HashSet<char> = HashSet::from_iter(backpack.right.chars());
        let items_in_both: Vec<&char> = items_in_left.intersection(&items_in_right).collect();
        let priority = get_priority(items_in_both[0]);
        priorities += priority;
    }
    println!("Part 1: {}", priorities);
}

fn get_priority(char: &char) -> i32 {
    if *char >= 'a' && *char <= 'z' {
        return (*char as i32) - ('a' as i32) + 1;
    } else {
        return (*char as i32) - ('A' as i32) + 27;
    }
}

fn read_lines(path: String) -> Vec<String> {
    let file = File::open(path).unwrap();
    io::BufReader::new(file).lines().flatten().collect()
}

fn parse_input(path: String) -> Vec<Backpack> {
    let lines = read_lines(path);
    lines.iter().map(|line| Backpack::new(line)).collect()
}
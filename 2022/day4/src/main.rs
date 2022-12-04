use std::io::{self, BufRead};
use std::fs;


fn main() {
    part_1();
    part_2();
}

fn part_1() {
    let input = parse_input("input1.txt".to_string());
    let mut count = 0;
    for pair in input {
        if pair.0.min >= pair.1.min && pair.0.max <= pair.1.max {
            count += 1;
        } else if pair.0.min <= pair.1.min && pair.0.max >= pair.1.max {
            count += 1;
        }
    }
    println!("Part 1: {}", count);
}

fn part_2() {
    let input = parse_input("input1.txt".to_string());
    let mut count = 0;
    for pair in input {
        if pair.0.max >= pair.1.min && pair.0.min <= pair.1.max {
            count += 1;
        }
    }
    println!("Part 2: {}", count);
}

#[derive(Debug)]
#[derive(Clone, Copy)]
struct Range {
    min: i32,
    max: i32,
}

impl Range {
    fn new(input: String) -> Range {
        let vals = input.split("-").map(|x| x.parse::<i32>().unwrap()).collect::<Vec<i32>>();
        Range {
            min: vals[0],
            max: vals[1],
        }
    }
}

#[derive(Debug)]
#[derive(Clone, Copy)]
struct Pair (Range, Range);

impl Pair {
    fn new(input: String) -> Pair {
        let vals = input.split(",").map(|x| Range::new(x.to_string())).collect::<Vec<Range>>();
        Pair(vals[0], vals[1])
    }
}

fn read_lines(path: String) -> Vec<String> {
    let file = fs::File::open(path).unwrap();
    io::BufReader::new(file).lines().flatten().collect()
}

fn parse_input(path: String) -> Vec<Pair> {
    let lines = read_lines(path);
    lines.iter().map(|line| Pair::new(line.to_owned())).collect()
}
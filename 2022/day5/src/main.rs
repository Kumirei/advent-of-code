use std::fs;
use std::io::{self, BufRead};

type Stack = Vec<char>;
type Cargo = Vec<Stack>;

#[derive(Debug)]
struct Move {
    from: u8,
    to: u8,
    count: u8,
}

struct Instructions {
    moves: Vec<Move>,
    cargo: Cargo,
}

fn main() {
    part_1("input1.txt");
    part_2("input1.txt");
}

fn part_1(path: &str) {
    let mut instructions = parse_input(path);

    instructions.moves.iter().for_each(|m| {
        for _ in 0..m.count {
            let c = instructions.cargo[m.from as usize].pop().unwrap();
            instructions.cargo[m.to as usize].push(c);
        }
    });

    let answer = instructions.cargo.iter().map(|stack| stack.last().unwrap()).collect::<String>();

    println!("Part 1 {:?}", answer);
}

fn part_2(path: &str) {
    let mut instructions = parse_input(path);

    instructions.moves.iter().for_each(|m| {
        let test: Vec<char> = (0..m.count).map(|_| instructions.cargo[m.from as usize].pop().unwrap()).collect();
        test.iter().rev().for_each(|c| instructions.cargo[m.to as usize].push(*c));
    });

    let answer = instructions.cargo.iter().map(|stack| stack.last().unwrap()).collect::<String>();

    println!("Part 2 {:?}", answer);
}



fn parse_input(path: &str) -> Instructions {
    let raw = fs::read_to_string(path).expect("Unable to read file");
    let (cargo, moves) = raw.split_once("\n\n").unwrap();

    // Get stacks
    let mut stacks: Cargo = Vec::new();
    cargo.lines().next().unwrap().chars().step_by(4).for_each(|c| stacks.push(Vec::new()));
    cargo.lines().rev().skip(1).for_each(|line| {
        line.chars().skip(1).step_by(4).enumerate().filter(|(i, c)| !c.is_whitespace()).for_each(|(i, c)| {
            stacks[i].push(c);
        });
    });



    // Get instructions
    let mut actions: Vec<Move> = Vec::new();
    moves.lines().for_each(|line| {
        let values: Vec<u8> = line.split_whitespace().skip(1).step_by(2).map(|x| x.parse::<u8>().unwrap()).collect();
        actions.push(Move {
            from: values[1]-1,
            to: values[2]-1,
            count: values[0],
        });
    });


    // Wrap up
    Instructions{
        moves: actions,
        cargo: stacks,
    }
}
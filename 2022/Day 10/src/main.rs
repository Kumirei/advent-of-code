use std::num::ParseIntError;
use std::fmt;

#[derive(Debug)]
enum Op {
    Noop,
    Add(i8),
}

#[derive(Debug)]
enum ParseOpError {
    ParseIntError,
    InvalidOp,
}

impl fmt::Display for ParseOpError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParseOpError::ParseIntError => write!(f, "ParseIntError"),
            ParseOpError::InvalidOp => write!(f, "InvalidOp"),
        }
    }
}

impl From<ParseIntError> for ParseOpError {
    fn from(_: ParseIntError) -> Self {
        ParseOpError::ParseIntError
    }
}

impl std::error::Error for ParseOpError {}

impl Op {
    fn from_str(s: &str) -> Result<Self, ParseOpError> {
        match s.split_once(" ") {
            Some(("addx", x)) => Ok(Op::Add(x.parse::<i8>()?)),
            None => Ok(Op::Noop),
            _ => Err(ParseOpError::InvalidOp),
        }
    }
}

fn processor(ops: &Vec<Op>, signal_strength: &mut i32, display: &mut Vec<Vec<char>>) {
    let mut cycle = 0;
    let mut reg = 1;

    for op in ops {
        match op {
            Op::Noop => tick(1, &mut cycle, reg, signal_strength, display),
            Op::Add(x) => {
                tick(2, &mut cycle, reg, signal_strength, display);
                reg += *x as i32;
            }
        };
    }
}

fn tick(count: u8, cycle: &mut u32, reg: i32, signal_strength: &mut i32, display: &mut Vec<Vec<char>>) {
    for _ in 0..count {
        let cycle_mod = *cycle % 40;
        match cycle_mod {
            19 => *signal_strength += reg * (1 + *cycle as i32),
            0 => display.push(Vec::new()), // New display row
            _ => (),
        }
        
        println!("Cycle: {}, Mod: {}, Reg: {}", cycle, cycle_mod, reg);
        println!("{}", display.last_mut().unwrap().iter().collect::<String>());
        let char = if (reg - (cycle_mod as i32)).abs() > 1 { '.' } else { '#' };
        display.last_mut().unwrap().push(char);
        *cycle += 1;
    }
}

fn parse_input(content: &String) -> Vec<Op> {
    let mut ops = Vec::new();
    for line in content.lines() {
        match Op::from_str(line) {
            Ok(op) => ops.push(op),
            Err(_) => panic!("Invalid op"),
        }
    }

    ops
}

fn main() {
    let path = "input.txt";
    let content = std::fs::read_to_string(path).unwrap();
    let ops = parse_input(&content);

    let mut signal_strength = 0;
    let mut display: Vec<Vec<char>> = vec![vec![]];
    processor(&ops, &mut signal_strength, &mut display);

    println!("Signal strength: {}", signal_strength);
    for row in display {
        println!("{}", row.iter().collect::<String>());
    }
}

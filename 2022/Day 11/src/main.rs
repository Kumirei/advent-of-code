use std::fs;

fn main() {
    let path = "input.txt";
    let num_rounds = 10000;
    let part = 2;

    let mut monkeys = parse_input(path);
    match &mut monkeys {
        Ok(v) => rounds(num_rounds,  v, part == 1),
        Err(e) => println!("Error {:?}", e),
    }
}

fn rounds(count: u32, monkeys: &mut Vec<Monkey>, unworried: bool) {
    let mod_value = monkeys.iter().fold(1, |acc, x| acc * x.test.divisor);

    for _ in 0..count {
        // for i in 0..1 {
        for i in 0..monkeys.len() {
            for j in 0..monkeys[i].items.len() {
                let mut monkey = &mut monkeys[i];
                // Inspect
                monkey.inspections += 1;
                let mut item = monkey.items[j];
                // println!("Monkey {} inspecting item {}", i, item);
                item = item.pow(monkey.operation.pow as u32);
                item *= monkey.operation.mult;
                item += monkey.operation.add;
                if unworried {
                    item /= 3;
                }

                // Mod value to LCM
                item %= mod_value;
                // println!("Monkey {} inspecting item {}", i, item);

                // Throw
                let mut index = monkey.test.ifFalse;
                if item % monkey.test.divisor == 0 {
                    index = monkey.test.ifTrue;
                }
                monkeys[index].items.push(item);
            }
            monkeys[i].items = vec![];
        }
    }

    // for monkey in monkeys.iter() {
    //     println!("{:?}", monkey);
    // }

    let res = monkeys.iter().map(|m| m.inspections).fold([0,0], |max, x| {
        if x > max[1] {
            [max[1], x]
        } else if x > max[0] {
            [x, max[1]]
        } else {
            max
        }
    }).iter().fold(1, |acc, x| acc * x);

    println!("Result: {}", res);
}

#[derive(Debug)]
struct Operation {
    add: u64,
    mult: u64,
    pow: u64,
}

#[derive(Debug)]
struct Test {
    divisor: u64,
    ifTrue: usize,
    ifFalse: usize,
}

#[derive(Debug)]
struct Monkey {
    items: Vec<u64>,
    operation: Operation,
    test: Test,
    inspections: u64,
}

impl Monkey {
    fn new() -> Self {
        Monkey {
            items: Vec::new(),
            operation: Operation {
                add: 0,
                mult: 1,
                pow: 1,
            },
            test: Test {
                divisor: 0,
                ifTrue: 0,
                ifFalse: 0,
            },
            inspections: 0,
        }
    }
}

#[derive(Debug)]
enum MonkeyParseError {
    InputError,
    ParseIntError,
}

fn parse_input(path: &str) -> Result<Vec<Monkey>, MonkeyParseError> {
    let content = fs::read_to_string(path).map_err(|_|MonkeyParseError::InputError)?;
    let parts = content.split("\n\n");
    
    let mut monkeys: Vec<Monkey> = Vec::new();

    for part in parts {
        let mut monkey = Monkey::new();
        for line in part.lines().skip(1).enumerate() {
            match line.0 {
                0 => {
                    let parts = line.1.split_once("items: ").ok_or(MonkeyParseError::InputError)?;
                    let items = parts.1.split(", ");
                    for item in items {
                        monkey.items.push(item.parse::<u64>().map_err(|_|MonkeyParseError::ParseIntError)?);
                    }
                },
                1 => {
                    let parts = line.1.split_once("new = ").ok_or(MonkeyParseError::InputError)?;
                    let mult = parts.1.split_once(" * ");
                    let add = parts.1.split_once(" + ");
                    if let Some(m) = mult {
                        if m.1 == "old" {
                            monkey.operation.pow = 2;
                        } else {
                            monkey.operation.mult = m.1.parse::<u64>().map_err(|_|MonkeyParseError::ParseIntError)?;
                        }
                    } else if let Some(a) = add {
                        monkey.operation.add = a.1.parse::<u64>().map_err(|_|MonkeyParseError::ParseIntError)?;
                    }
                },
                2 => {
                    let parts = line.1.split_once(" by ").ok_or(MonkeyParseError::InputError)?;
                    monkey.test.divisor = parts.1.parse::<u64>().map_err(|_|MonkeyParseError::ParseIntError)?;
                },
                3 => {
                    let parts = line.1.split_once("monkey ").ok_or(MonkeyParseError::InputError)?;
                    monkey.test.ifTrue = parts.1.parse::<usize>().map_err(|_|MonkeyParseError::ParseIntError)?;
                },
                4 => {
                    let parts = line.1.split_once("monkey ").ok_or(MonkeyParseError::InputError)?;
                    monkey.test.ifFalse = parts.1.parse::<usize>().map_err(|_|MonkeyParseError::ParseIntError)?;
                },
                _ => (),
            }
        }
        monkeys.push(monkey);
    }

    Ok(monkeys)
}
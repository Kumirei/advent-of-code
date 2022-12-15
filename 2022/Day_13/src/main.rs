use std::cmp::Ordering;

fn main() {
    part_1("input.txt");
    part_2("input.txt");
}

fn part_2(path: &str) {
    let input = parse_input(path);
    let mut values = input
        .iter()
        .flat_map(|Pair(a,b)| vec![a,b])
        .collect::<Vec<&Value>>();
    
    let a = &Value::List(vec![Value::Int(2)]);
    let b = &Value::List(vec![Value::Int(6)]);
    values.push(a);
    values.push(b);

    values.sort_by(|a, b| {
        match is_correct_order(*a, *b) {
            Comparison::Smaller => return Ordering::Less,
            Comparison::Same => return Ordering::Equal,
            Comparison::Larger => return Ordering::Greater,
        }
    });

    // for value in values.iter() {
    //     println!("Value {:?}", value);
    // }

    let test = values.iter().enumerate().filter(|(_, val)|  {
        match val {
            Value::List(val) => {
                if val.len() != 1 {
                    return false;
                }
                match val.first().unwrap() {
                    Value::Int(2) => return true,
                    Value::Int(6) => return true,
                    _ => return false,
                }
            },
            _ => return false,
        }
    })
    .fold(1, |acc, (i, _)| acc*(i+1));

    println!("test: {:?}", test);
}

fn part_1(path: &str) {
    let input = parse_input(path);
    let sum = input
        .iter()
        .enumerate()
        .filter(|(i, Pair(a, b))| {
            // if i > &3 {
            //     return false;
            // }
            if let Comparison::Smaller = is_correct_order(a, b) {
                // println!("SMALLER {}", i+1);
                return true;
            }
            // println!("NOT SMALLER {}", i+1);
            return false;
        })
        .fold(0, |sum, (i, _)| sum + i+1);


    // for Pair(a,b) in input {
    //     println!("{:?}", is_correct_order(&a, &b));
    // }
    

    println!("Sum: {}", sum);
}

#[derive(Debug)]
enum Comparison {
    Smaller,
    Larger,
    Same,
}

fn is_correct_order(a: &Value, b: &Value) -> Comparison {
    // println!("Comparing {:?} and {:?}", a, b);
    match (a, b) {
        (Value::Int(a), Value::Int(b)) => {
            if a < b {
                return Comparison::Smaller;
            } else if a == b {
                return Comparison::Same;
            } else {
                return Comparison::Larger;
            }
        },
        (Value::List(a), Value::List(b)) => {
            for i in 0..a.len() {
                // Right ran out first, wrong order
                if i == b.len() {
                    return Comparison::Larger;
                }
                // Compare elements
                match is_correct_order(&a[i], &b[i]) {
                    Comparison::Smaller => return Comparison::Smaller,
                    Comparison::Same => (),
                    Comparison::Larger => return Comparison::Larger,
                }

            }
            // Ran out at the same time!
            if a.len() == b.len() {
                return Comparison::Same;
            }
            // Left ran out first, right order
            return Comparison::Smaller;
        },
        (Value::List(_), Value::Int(b)) => {
            return is_correct_order(a, &Value::List(vec![Value::Int(*b)]));
        },
        (Value::Int(a), Value::List(_)) => {
            return is_correct_order(&Value::List(vec![Value::Int(*a)]), b);
        }
    }
}

fn parse_input(path: &str) -> Vec<Pair> {
    let mut pairs = Vec::new();
    
    let contents = std::fs::read_to_string(path).unwrap();
    for part in contents.split("\n\n") {
        let (left, right) = part.split_once("\n").unwrap();
        pairs.push(Pair(parse_value(left), parse_value(right)));
    }

    pairs
}

fn parse_value(list: &str) -> Value {
    let mut stack: Vec<Vec<Value>> = vec![Vec::new()];
    let mut chars: Vec<String> = Vec::new();

    for c in list.chars() {
        match c {
            '[' => stack.push(Vec::new()),
            ']' => {
                if chars.len() > 0 {
                    let num = chars.join("");
                    // println!("parsing {} ", num);
                    let num: i8 = num.parse().unwrap();
                    stack.last_mut().unwrap().push(Value::Int(num));
                    chars = vec![];
                }
                let val = stack.pop().unwrap();
                stack.last_mut().unwrap().push(Value::List(val));
            },
            ',' => {
                if chars.len() > 0 {
                    let num = chars.join("");
                    // println!("parsing {} ", num);
                    let num: i8 = num.parse().unwrap();
                    stack.last_mut().unwrap().push(Value::Int(num));
                    chars = vec![];
                }
            },
            n => {
                chars.push(n.to_string());
            }
        }
    }

    Value::List(stack.pop().unwrap())
}

#[derive(Debug)]
struct Pair (Value, Value);

#[derive(Debug)]
enum Value {
    Int(i8),
    List(Vec<Value>),
}
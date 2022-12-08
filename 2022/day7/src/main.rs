use std::collections::{HashMap, BTreeMap};

// enum Command<'l> {
//     List,
//     Root,
//     Return,
//     Enter(&'l str),
//     File(&'l str, u32),
//     Dir(&'l str),
// }

// impl<'l> Command<'l> {
//     fn from_string(str: &str) -> Result<Self, String> {
//         if str.starts_with("$") {
//             let rest = &str[2..];
//             return match rest.split_once(" ") {
//                 None => Ok(Command::List),
//                 Some((command, argument)) if command == "cd" => match argument {
//                     "/" => Ok(Command::Root),
//                     ".." => Ok(Command::Return),
//                     name => Ok(Command::Enter(name)),
//                 },
//                 Some(_) => Err(format!("Unknown command: {}", str)),
//             }
//         }

//         if str.starts_with("dir") {
//             return Ok(Command::Dir(&str[4..]));
//         }

//         match str.split_once(" ") {
//             Some((size, name)) => Ok(Command::File(name, size.parse().map_err(|_| format!("Unknown command: {}", str))?)),
//             None => Err(format!("Unknown command: {}", str)),
//         }
//     }
// }

// struct Folder<'l> {
//     name: &'l str,
//     content: HashMap<&'l str, Folder<'l>>,
//     parent: Option<&'l Folder<'l>>,
//     size: u32,
// }

// impl<'l> Folder<'l> {
//     fn new(name: &'l str, size: &'l u32, parent: Option<&'l Folder<'l>>) -> Self {
//         Self {
//             name: name,
//             content: HashMap::new(),
//             size: *size,
//             parent: parent,
//         }
//     }

//     fn touch(&mut self, name: &'l str, size: &'l u32, parent: Option<&'l Folder<'l>>) {
//         self.content.insert(name, Folder::new(name, size, parent));
//     }
// }

// fn build_directory<'l>(commands: &Vec<Command>) -> Folder<'l> {
//     let root = Folder::new("/", &0, None);
//     let mut dir = &mut root;

//     for command in commands {
//         match command {
//             Command::List => {},
//             Command::Root => {},
//             Command::Return => {
//                 dir = dir.parent.unwrap();
//             },
//             Command::Enter(name) => {
//                 dir = dir.content.get(name).unwrap();
//             },
//             Command::File(name, size) => {
//                 dir.touch(name, &size, Some(dir));
//             },
//             Command::Dir(name) => {
//                 dir.touch(name, &0, Some(dir));
//             },
//         }
//     }

//     root
// }

// fn parse_commands(path: &str) -> Vec<Command> {
//     let content = std::fs::read_to_string(path).unwrap();
//     content.lines().map(|line| Command::from_string(line).unwrap()).collect()
// }

#[derive(Debug)]
enum Entry<'l> {
    Up,
    Down(&'l str),
    File(&'l str, u32),
}

impl<'l> Entry<'l> {
    fn from_str(str: &'l str) -> Option<Self> {
        if str.starts_with("$ cd ..") {
            return Some(Entry::Up);
        };
        if str.starts_with("$ cd ") {
            return Some(Entry::Down(&str[5..]));
        };
        match str.split_once(" ") {
            Some((size, name)) => {
                match size.parse() {
                    Ok(size) => Some(Entry::File(name, size)),
                    Err(_) => None,
                }
            },
            None => None,
        }
    }
}

fn parse_entries(content: &String) -> Vec<Entry> {
    let mut entries: Vec<Entry> = Vec::new();

    for line in content.lines().skip(1) {
        match Entry::from_str(line) {
            Some(entry) => entries.push(entry),
            None => {},
        }
    };

    entries
}

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let mut entries = parse_entries(&content);
    entries.push(Entry::Up);
    entries.push(Entry::Up);

    let mut stack: Vec<u32> = vec![0];
    let mut sizes: Vec<u32> = Vec::new();

    for entry in entries {
        match entry {
            Entry::Up => {
                let size = stack.pop().unwrap();
                sizes.push(size);
                if stack.len() > 0 {
                    let last_index = stack.len() - 1;
                    stack[last_index] += size;
                }
            },
            Entry::Down(name) => {
                stack.push(0);
            },
            Entry::File(name, size) => {
                let last_index = stack.len() - 1;
                stack[last_index] += size;
            },
        }
    }

    let result: u32 = sizes.iter().filter(|size| **size <= 100_000).sum();

    println!("Part 1: {}", result);
}

fn part_2(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let entries = parse_entries(&content);

    let mut stack: Vec<u32> = vec![0];
    let mut sizes: Vec<u32> = Vec::new();

    for entry in entries {
        match entry {
            Entry::Up => {
                let size = stack.pop().unwrap();
                sizes.push(size);
                if stack.len() > 0 {
                    let last_index = stack.len() - 1;
                    stack[last_index] += size;
                }
            },
            Entry::Down(name) => {
                stack.push(0);
            },
            Entry::File(name, size) => {
                let last_index = stack.len() - 1;
                stack[last_index] += size;
            },
        }
    }
    while stack.len() > 0 {
        let size = stack.pop().unwrap();
        sizes.push(size);
    }

    let total_space = 70_000_000;
    let needed_space = 30_000_000;
    let used_space: u32 = sizes.last().unwrap().clone();
    println!("used: {used_space:?} free {}", total_space - used_space);
    let to_free = needed_space - (total_space - used_space);

    println!("sizes 2: {:?}", sizes);
    let mut result = sizes
    .iter().filter(|size| **size >= to_free).collect::<Vec<&u32>>();
    println!("result 2: {:?}", result);
    result.sort();
    let smallest = result.first().unwrap();

    println!("Part 2: {:?}", smallest);
}

fn main() {
    part_1("input1.txt");
    part_2("input1.txt");
}


use std::collections::HashMap;

enum Command<'l> {
    List,
    Root,
    Return,
    Enter(&'l str),
    File(&'l str, u32),
    Dir(&'l str),
}

impl<'l> Command<'l> {
    fn from_string(str: &str) -> Result<Self, String> {
        if str.starts_with("$") {
            let rest = &str[2..];
            return match rest.split_once(" ") {
                None => Ok(Command::List),
                Some((command, argument)) if command == "cd" => match argument {
                    "/" => Ok(Command::Root),
                    ".." => Ok(Command::Return),
                    name => Ok(Command::Enter(name)),
                },
                Some(_) => Err(format!("Unknown command: {}", str)),
            }
        }

        if str.starts_with("dir") {
            return Ok(Command::Dir(&str[4..]));
        }

        match str.split_once(" ") {
            Some((size, name)) => Ok(Command::File(name, size.parse().map_err(|_| format!("Unknown command: {}", str))?)),
            None => Err(format!("Unknown command: {}", str)),
        }
    }
}

fn parse_commands(path: &str) -> Vec<Command> {
    let content = std::fs::read_to_string(path).unwrap();
    content.lines().map(|line| Command::from_string(line).unwrap()).collect()

}

struct Folder<'l> {
    name: &'l str,
    content: HashMap<&'l str, Folder<'l>>,
    parent: Option<&'l Folder<'l>>,
    size: u32,
}

impl<'l> Folder<'l> {
    fn new(name: &'l str, size: &'l u32, parent: Option<&'l Folder<'l>>) -> Self {
        Self {
            name: name,
            content: HashMap::new(),
            size: *size,
            parent: parent,
        }
    }

    fn touch(&mut self, name: &'l str, size: &'l u32, parent: Option<&'l Folder<'l>>) {
        self.content.insert(name, Folder::new(name, size, parent));
    }
}

fn build_directory<'l>(commands: &Vec<Command>) -> Folder<'l> {
    let root = Folder::new("/", &0, None);
    let mut dir = &mut root;

    for command in commands {
        match command {
            Command::List => {},
            Command::Root => {},
            Command::Return => {
                dir = dir.parent.unwrap();
            },
            Command::Enter(name) => {
                dir = dir.content.get(name).unwrap();
            },
            Command::File(name, size) => {
                dir.touch(name, &size, Some(dir));
            },
            Command::Dir(name) => {
                dir.touch(name, &0, Some(dir));
            },
        }
    }

    root
}

fn part_1(path: &str) {
    let commands = parse_commands(path);
    let mut dir = build_directory(&commands);
}

fn main() {
    part_1("sample.txt");
}


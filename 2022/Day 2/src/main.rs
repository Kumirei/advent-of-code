use std::fs;

fn main() {
    part1();
    part2();
}

fn part2() {
    let games = parseInput("input1.txt");
    let mut total = 0;
    for game in games.iter() {
        total += play2(game);
    }
    println!("Part 2: {}", total);
}

fn part1() {
    let games = parseInput("input1.txt");
    let mut total = 0;
    for game in games.iter() {
        total += play(game);
    }
    println!("Part 1: {}", total);
}

fn play2(game: &Game) -> i32 {
    // Rock = lose, Paper = draw, Scissors = win
    if game.opponent == Play::Rock && game.player == Play::Rock {
        return 0 + 3;
    }
    if game.opponent == Play::Rock && game.player == Play::Paper {
        return 3 + 1;
    }
    if game.opponent == Play::Rock && game.player == Play::Scissors {
        return 6 + 2;
    }

    if game.opponent == Play::Paper && game.player == Play::Rock {
        return 0 + 1;
    }
    if game.opponent == Play::Paper && game.player == Play::Paper {
        return 3 + 2;
    }
    if game.opponent == Play::Paper && game.player == Play::Scissors {
        return 6 + 3;
    }

    if game.opponent == Play::Scissors && game.player == Play::Rock {
        return 0 + 2;
    }
    if game.opponent == Play::Scissors && game.player == Play::Paper {
        return 3 + 3;
    }
    if game.opponent == Play::Scissors && game.player == Play::Scissors {
        return 6 + 1;
    }
    0
}

fn play(game: &Game) -> i32 {
    if game.opponent == Play::Rock && game.player == Play::Rock {
        return 3 + 1;
    }
    if game.opponent == Play::Paper && game.player == Play::Paper {
        return 3 + 2;
    }
    if game.opponent == Play::Scissors && game.player == Play::Scissors {
        return 3 + 3;
    }

    if game.opponent == Play::Rock && game.player == Play::Scissors {
        return 0 + 3;
    }
    if game.opponent == Play::Paper && game.player == Play::Rock {
        return 0 + 1;
    }
    if game.opponent == Play::Scissors && game.player == Play::Paper {
        return 0 + 2;
    }

    if game.opponent == Play::Rock && game.player == Play::Paper {
        return 6 + 2;
    }
    if game.opponent == Play::Paper && game.player == Play::Scissors {
        return 6 + 3;
    }
    if game.opponent == Play::Scissors && game.player == Play::Rock {
        return 6 + 1;
    }
    0
}

#[derive(Debug)]
struct Game {
    opponent: Play,
    player: Play,
}

#[derive(Debug)]
#[derive(PartialEq)]
enum Play {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

fn fromChar(c: &str) -> Play {
    match c {
        "A" => Play::Rock,
        "B" => Play::Paper,
        "C" => Play::Scissors,
        "X" => Play::Rock,
        "Y" => Play::Paper,
        "Z" => Play::Scissors,
        _ => panic!("Invalid input"),
    }
}

fn parseInput(path: &str) -> Vec<Game> {
    let contents = fs::read_to_string(path).expect("Could not read file");
    let mut games: Vec<Game> = vec![];

    for line in contents.lines() {
        let split = line.split(" ").collect::<Vec<&str>>();
        let game = Game {
            opponent: fromChar(split[0]),
            player: fromChar(split[1]),
        };
        games.push(game);
    }
    games
}
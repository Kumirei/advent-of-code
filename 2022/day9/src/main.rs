#[derive(Debug)]
enum Move {
    Up(i8),
    Down(i8),
    Left(i8),
    Right(i8),
}

fn parse_moves(content: &str) -> Vec<Move> {
    let mut moves = Vec::new();
    for line in content.lines() {
        match line.chars().next().unwrap() {
            'U' => moves.push(Move::Up(line[2..].parse().unwrap())),
            'D' => moves.push(Move::Down(line[2..].parse().unwrap())),
            'L' => moves.push(Move::Left(line[2..].parse().unwrap())),
            'R' => moves.push(Move::Right(line[2..].parse().unwrap())),
            _ => panic!("Invalid move"),
        };
    }

    moves
} 

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let mut moves = parse_moves(&content);

    let mut head = (0, 0);

    let mut tail = (0, 0);
    let mut visited = std::collections::HashSet::new();

    for mv in moves {
        let mut direction = (0, 0);
        let mut distance = 0;
        match mv {
            Move::Up(dir) => {
                direction = (0, 1);
                distance = dir;
            },
            Move::Down(dir) => {
                direction = (0, -1);
                distance = dir;
            },
            Move::Left(dir) => {
                direction = (-1, 0);
                distance = dir;
            },
            Move::Right(dir) => {
                direction = (1, 0);
                distance = dir;
            }
        }

        let mut leader = head;
        for _ in 0..distance {
            head.0 += direction.0;
            head.1 += direction.1;
            let direction: (i32, i32) = (head.0 - tail.0, head.1 - tail.1);
            if direction.0.abs() > 1 || direction.1.abs() > 1 {
                tail.0 += direction.0.signum();
                tail.1 += direction.1.signum();
            }
            visited.insert(tail);
        }


    }

    let count = visited.len();
    println!("Part 1: {}", count);
}

fn part_2(path: &str, num_knots: u8) {
    let content = std::fs::read_to_string(path).unwrap();
    let moves = parse_moves(&content);

    let mut knots = Vec::new();
    for _ in 0..num_knots {
        knots.push((0, 0));
    }

    let mut visited = std::collections::HashSet::new();

    for mv in moves {
        let mut direction = (0, 0);
        let mut distance = 0;
        match mv {
            Move::Up(dir) => {
                direction = (0, 1);
                distance = dir;
            },
            Move::Down(dir) => {
                direction = (0, -1);
                distance = dir;
            },
            Move::Left(dir) => {
                direction = (-1, 0);
                distance = dir;
            },
            Move::Right(dir) => {
                direction = (1, 0);
                distance = dir;
            }
        }


        for _ in 0..distance {
            knots[0].0 += direction.0;
            knots[0].1 += direction.1;

            for k in 1..knots.len() {
                let direction: (i32, i32) = (knots[k-1].0 - knots[k].0, knots[k-1].1 - knots[k].1);

                if direction.0.abs() > 1 || direction.1.abs() > 1 {
                    knots[k].0 += direction.0.signum();
                    knots[k].1 += direction.1.signum();
                }
            }
            visited.insert(knots[knots.len()-1]);
        }
    }

    let count = visited.len();
    println!("Part 2: {}", count);
}

fn main() {
    part_1("input.txt");
    part_2("input.txt", 10);
}

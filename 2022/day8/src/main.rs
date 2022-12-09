#[derive(Debug)]
struct Tree {
    height: u8,
    visible: bool,
}

fn parse_input(content: &str) -> Vec<Vec<u8>> {
    let mut forest = Vec::new();
    for line in content.lines() {
        let mut row = Vec::new();
        for char in line.chars() {
            let num = (char as u8) - ('0' as u8);
            row.push(num);
        }
        forest.push(row);
    }

    forest
}

fn count_visible(forest: &Vec<Vec<u8>>) -> u32 {
    let mut visible = std::collections::HashSet::new();

    let forestLength = forest.len();
    let rowLength = forest[0].len();

    // Horizontal
    for i in 0..forestLength {
        let mut maxLeft: i8 = -1;
        let mut maxRight: i8 = -1;
        for j in 0..rowLength {
            if forest[i][j] as i8 > maxLeft {
                maxLeft = forest[i][j] as i8;
                visible.insert((i,j));
            }
            if forest[i][rowLength - j - 1] as i8 > maxRight {
                maxRight = forest[i][rowLength - j - 1] as i8;
                visible.insert((i,rowLength - j - 1));
            }
        }
    }

    // Vertical
    for i in 0..rowLength {
        let mut maxUp: i8 = -1;
        let mut maxDown: i8 = -1;
        for j in 0..forestLength {
            if forest[j][i] as i8 > maxDown {
                maxDown = forest[j][i] as i8;
                visible.insert((j,i));
            }
            if forest[forestLength - j - 1][i] as i8 > maxUp {
                maxUp = forest[forestLength - j - 1][i] as i8;
                visible.insert((forestLength - j - 1,i));
            }
        }
    }


    // Count
    let mut count = visible.len();

    count as u32
}

fn get_score(forest: &Vec<Vec<u8>>) -> u32 {
    let mut best: u32 = 0;

    for y in 0..forest.len() {
        for x in 0..forest[0].len() {
            let height = forest[y][x];
            // Calculate score for tree
            let mut score: u32 = 1;

            // Right
            score *= score_slice(forest[y][(x+1)..].iter(), height) as u32;
            // Left
            score *= score_slice(forest[y][0..x].iter().rev(), height) as u32;
            // Up
            score *= score_slice(forest[0..y].iter().map(|row| &row[x]).rev(), height) as u32;
            // Down
            score *= score_slice(forest[y+1..].iter().map(|row| &row[x]), height) as u32;
            if score as u32 > best {
                best = score as u32;
            }

        }
    }

    best
}

fn score_slice<'l>(iter: impl Iterator<Item = &'l u8>, height: u8) -> u8 {
    let mut score: u8 = 0;
    // println!("test 1 {}", iter.take_while(|tree| **tree >= height).count() as u8);
    for tree in iter {
        score += 1;
        if *tree >= height { // Can't see further
            break;
        }
    }

    score
}

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let forest = parse_input(&content);
    let visible = count_visible(&forest);

    println!("Part 1: {}", visible);
}

fn part_2(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let forest = parse_input(&content);
    let score = get_score(&forest);

    println!("Part 2: {}", score);
}

fn main() {
    part_1("input.txt");
    part_2("input.txt");
}
use std::collections::VecDeque;

fn main() {
    let path = "input.txt";
    part_1(path);
    part_2(path);
}

fn part_2(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let (start, end, mat) = parse_input(&content).unwrap();

    let mut min = std::u32::MAX;
    for y in 0..mat.len() {
        for x in 0..mat[0].len() {
            if mat[y][x] != 0 {
                continue;
            }
            let mut mat = mat.clone();
            let start = (x, y);
            let cost = djikstra(mat, start, end);
            if cost < min {
                min = cost;
            }
        }
    }

    println!("Part 2: {}", min);
}

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();
    let (start, end, mat) = parse_input(&content).unwrap();
    let cost = djikstra(mat, start, end);

    println!("Part 1: {}", cost);
}

fn djikstra(map: Vec<Vec<u8>>, start: (usize, usize), end: (usize, usize)) -> u32 {
    let mut costs = vec![vec![std::u32::MAX; map[0].len()]; map.len()];
    let mut visited = std::collections::HashSet::new();
    let mut queue: VecDeque<(usize, usize)> = std::collections::VecDeque::new();
    costs[start.1 as usize][start.0 as usize] = 0;

    queue.push_back(start);
    while !queue.is_empty() {
        let (x, y) = queue.pop_front().unwrap();
        // Skip if visited
        if visited.contains(&(x, y)) {
            continue;
        }

        visited.insert((x, y));
        let elevation = map[y][x];
        let cost = costs[y][x];

        // Inspect neighbors
        let neighbors: Vec<(i32, i32)> = vec![(1, 0), (-1, 0), (0, 1), (0, -1)];
        for (dx, dy) in neighbors {
            // Skip if out of bounds
            if (x == 0 && dx == -1) || (y == 0 && dy == -1) {
                continue;
            }
            let (x, y) = ((x as i32 + dx) as usize, (y as i32 + dy) as usize);
            if x >= map[0].len()|| y >= map.len() {
                continue;
            }
            // Skip if elevation difference is too big
            if (map[y][x] as i8 - elevation as i8) > 1 {
                continue;
            }

            // Process
            let new_cost = cost + 1;
            if new_cost < costs[y][x] {
                costs[y][x] = new_cost;
            }

            queue.push_back((x, y));
        }
    }

    costs[end.1 as usize][end.0 as usize]
}

fn parse_input(content: &str) -> Result<((usize, usize), (usize, usize), Vec<Vec<u8>>), String> {
    let mut result = Vec::new();
    let mut start = (0, 0);
    let mut end = (0, 0);
    for (y, line) in content.lines().enumerate() {
        let mut row = Vec::new();
        for (x, c) in line.chars().enumerate() {
            let mut num: u8;
            match c {
                'S' => {
                    start = (x as usize, y as usize);
                    num = 'a' as u8 - 'a' as u8;
                },
                'E' => {
                    end = (x as usize, y as usize);
                    num = 'z' as u8 - 'a' as u8;
                },
                _ => {
                    num = c as u8 - 'a' as u8;
                }
            }
            row.push(num);
        }
        result.push(row);
    }
    Ok((start, end, result))
}
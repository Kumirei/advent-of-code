use std::{time::Instant, collections::{HashMap, VecDeque, HashSet}, cmp};

fn parse_data(path: &str) -> Vec<(i32, Vec<usize>)> {
    let content = std::fs::read_to_string(path).unwrap();

    // Parse data
    let mut temp: Vec<(&str, i32, Vec<&str>)> = Vec::new();
    for line in content.lines() {
        let (left, right) = line.split_once(";").unwrap();
        let (name, value) = left.split_once(",").unwrap();
        let value = value.parse::<i32>().unwrap();
        let neighbors: Vec<&str> = right.split(",").collect();
        temp.push((name, value, neighbors));
    }
    temp.sort();
    // Map names to numbers
    let names: HashMap<&str, usize> = temp
        .iter()
        .enumerate()
        .map(|(i, (name, _, _))| (*name, i))
        .collect();
    // Collect data
    let data: Vec<(i32, Vec<usize>)> = temp
        .iter()
        .map(|(_, value, neighbors)| (*value, neighbors
            .iter()
            .map(|n| names[*n])
            .collect()
        ))
        .collect();

    data
}

fn get_distances(data: &Vec<(i32, Vec<usize>)>) -> HashMap<usize, Vec<(usize, u32)>> {
    // Calculate distances from every node to every other node
    // This is a BFS from every node
    let mut distances: Vec<Vec<u32>> = vec![vec![0; data.len()]; data.len()];
    for start in 0..data.len() {
        let mut q: VecDeque<(usize, u32)> = VecDeque::new();
        let mut visited: HashSet<usize> = HashSet::new();
        q.push_back((start, 0));

        while q.len() > 0 {
            let (curr, dist) = q.pop_front().unwrap();
            // Continue if already visited
            if visited.contains(&curr) {
                continue;
            }
            // Otherwise set distance from start
            distances[start][curr] = dist;
            visited.insert(curr);
            // Then traverse neighbors
            let neighbors = &data[curr].1;
            for neighbor in neighbors {
                q.push_back((*neighbor, dist + 1));
            }
        }
    }

    // Prune nodes with val 0
    // let data: Vec<&(i32, Vec<usize>)> = data.iter().filter(|x| x.0 > 0).collect();
    let mut distances: HashMap<usize, Vec<(usize, u32)>> = distances
        .iter()
        .enumerate()
        .filter(|(i, _)| i == &0 || data[*i].0 > 0)
        .map(|(i, list)| (i, 
            list
            .iter()
            .enumerate()
            .filter(|(i, _)| data[*i].0 > 0)
            .map(|(i, dist)| (i, *dist))
            .collect()
        ))
        .collect();

    distances
}

fn part_1(path: &str) {
    let data = parse_data(path);
    let distances = get_distances(&data);

    let mut memo: HashMap<String, i32> = HashMap::new();
    let res = dfs(&data, &distances, &mut memo, 0, 0, 30, 0);
    println!("Part 1 {}", res);
}

fn part_2(path: &str) {
    let data = parse_data(path);
    let distances = get_distances(&data);

    let mut memo: HashMap<String, i32> = HashMap::new();
    let res = dfs(&data, &distances, &mut memo, 0, 0, 26, 1);
    println!("Part 2 {}", res);
}

fn dfs(
    data: &Vec<(i32, Vec<usize>)>, 
    distances: &HashMap<usize, Vec<(usize, u32)>>, 
    memo: &mut HashMap<String, i32>, 
    opened: u64, // bitmask
    curr: usize, 
    time: i32, 
    players_left: i32
) -> i32 {
    // Check memo
    let key = opened.to_string() + curr.to_string().as_str() + time.to_string().as_str() + players_left.to_string().as_str();
    if memo.contains_key(&key) {
        return *memo.get(&key).unwrap();
    };
    // Open current valve if not already open and not 0
    let released: i32 = time * data[curr].0;
    let opened = opened | (1 << curr); // Open valve
    // Move to other valves and open
    let mut max = distances.get(&curr).unwrap().iter().fold(0, |max, (neighbor, dist)| {
        if opened & (1 << neighbor) != 0 { // If open
            return max;
        }
        let val = dfs(data, distances, memo, opened, *neighbor, time-*dist as i32-1, players_left);
        return cmp::max(max, val);
    });
    // Go to next player
    if players_left > 0 {
        let val = dfs(data, distances, memo, opened, 0, 26, players_left - 1);
        max = cmp::max(max, val);
    }
    // Set memo
    let total = max + released;
    memo.insert(key, max + released);

    total
}

fn main() {
    let now = Instant::now();
    part_1("input.txt");
    let elapsed = now.elapsed();
    println!("Elapsed part 1: {:.2?}", elapsed);
    let now = Instant::now();
    part_2("input.txt");
    let elapsed = now.elapsed();
    println!("Elapsed part 2: {:.2?}", elapsed);
}
use std::fs;

fn main() {
    // Read file
    let contents = fs::read_to_string("input1.txt").expect("Something went wrong reading the file");
    let split = contents.lines();
    let vec: Vec<&str> = split.collect();

    // Split into vectors
    let mut elves: Vec<Vec<i32>> = vec![vec![]];
    let mut index = 0;

    for line in vec.iter() {
        if line.is_empty() {
            index += 1;
            elves.push(vec![]);
            continue;
        }
        elves[index].push(line.parse().unwrap());
    }

    // Find largest sum
    println!("Elves {:?}", elves);
    let mut largest = 0;
    for elf in elves.iter() {
        let mut sum = 0;
        for calories in elf.iter() {
            sum += calories;
        }
        if sum > largest {
            largest = sum;
        }
    }

    println!("Largest sum: {}", largest);

}
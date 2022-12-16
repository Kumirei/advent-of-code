use std::collections::{HashMap, HashSet};
use std::time::Instant;

#[derive(Debug)]
struct Point {
    x: i64,
    y: i64,
}

#[derive(Debug)]
struct Reading {
    sensor: Point,
    beacon: Point,
}

fn part_1(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();

    let mut readings: Vec<Reading> = Vec::new();
    for line in content.lines() {
        let vals: Vec<i64> = line.split(",").map(|x| x.parse::<i64>().unwrap()).collect();
        readings.push(Reading {
            sensor: Point {
                x: vals[0],
                y: vals[1],
            },
            beacon: Point {
                x: vals[2],
                y: vals[3],
            }
        });
    }

    let row_number = 2000000;
    let mut empty_points: HashSet<i64> = HashSet::new();
    for reading in readings.iter() {
        // println!("{:?}", reading);
        let manhattan = (reading.sensor.x - reading.beacon.x).abs() + (reading.sensor.y - reading.beacon.y).abs();
        // println!("manhattan {}", manhattan);
        let dist_to_row = (reading.sensor.y - row_number).abs();
        // println!("Dist {}", dist_to_row);
        let diff = (manhattan - dist_to_row).abs();
        if manhattan > dist_to_row {
            let (left, right) = (reading.sensor.x - diff, reading.sensor.x + diff);
            // println!("Left {} Right {}", left, right);
            for i in left..right+1 {
                empty_points.insert(i);
            }
            
        }
    }

    for reading in readings.iter() {
        if reading.beacon.y == row_number {
            empty_points.remove(&reading.beacon.x);
        }
    }

    println!("Points {}", empty_points.len());
    // println!("Points {:?}", empty_points);
}

fn part_2(path: &str) {
    let content = std::fs::read_to_string(path).unwrap();

    let mut readings: Vec<Reading> = Vec::new();
    for line in content.lines() {
        let vals: Vec<i64> = line.split(",").map(|x| x.parse::<i64>().unwrap()).collect();
        readings.push(Reading {
            sensor: Point {
                x: vals[0],
                y: vals[1],
            },
            beacon: Point {
                x: vals[2],
                y: vals[3],
            }
        });
    }

    let size = 4_000_000;
    'rows: for y in 0..size+1 {
        if y % 100_000 == 0 {
            println!("Y = {}", y);
        }
        let mut blocks: Vec<(i64, i64)> = readings.iter()
            .filter(|reading| {
                let manhattan = (reading.sensor.x - reading.beacon.x).abs() + (reading.sensor.y - reading.beacon.y).abs();
                let dist_to_row = (reading.sensor.y - y).abs();
                manhattan > dist_to_row
            })
            .map(|reading| {
                let manhattan = (reading.sensor.x - reading.beacon.x).abs() + (reading.sensor.y - reading.beacon.y).abs();
                let dist_to_row = (reading.sensor.y - y).abs();
                let diff = (manhattan - dist_to_row).abs();
                (reading.sensor.x - diff, reading.sensor.x + diff)
            }).collect();
        blocks.sort_by(|a, b| a.0.cmp(&b.0));
        
        // println!("y = {}", y);
        // println!("blocks = {:?}", blocks);


        if blocks[0].0 > 0 {
            println!("STARTS OVER x=0");
            break 'rows;
        }
        let mut max = blocks[0].1;
        for x in 1..blocks.len() {
            let curr = blocks[x];
            if max < curr.0 {
                println!("FOUND AT x={} y={}, tuning frequency={}", curr.0-1, y, (curr.0-1) * 4000000 + y);
                break 'rows;
            }
            if curr.1 > max {
                max = curr.1;
            }
        }
    }

    // println!("READINGS {:?}", readings);
}

fn main() {
    part_1("sample.txt");
    let now = Instant::now();
    part_2("input.txt");
    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);
}
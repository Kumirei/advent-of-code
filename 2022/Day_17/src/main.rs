use std::{collections::{HashSet, HashMap}, time::Instant};

#[derive(Debug)]
enum Jet {
    Left,
    Right,
    Down
}

impl Jet {
    fn from_char(char: char) -> Option<Self> {
        if char == '<' {
            return Some(Jet::Left);
        } else if char == '>' {
            return Some(Jet::Right);
        } else {
            return None;
        }
    }
}

#[derive(Eq, Hash, PartialEq, Debug)]
struct Point(i32, i32);

#[derive(Debug)]
enum Piece {
    Line,
    Plus,
    Jay,
    Stick,
    Box
}

struct Board<'l> {
    pieces: Vec<&'l Piece>,
    board: HashSet<Point>,
    piece: &'l Piece,
    position: Point,
    tick_count: u64,
    height: u64,
}

impl<'l> Board<'l> {
    fn new() -> Self {
        Board {
            pieces: vec![&Piece::Line, &Piece::Plus, &Piece::Jay, &Piece::Stick, &Piece::Box],
            board: HashSet::new(),
            piece: &Piece::Line,
            position: Point(2,3),
            tick_count: 0,
            height: 0,
        }
    }

    fn translate(&mut self, jet: &Jet) -> bool {
        let can_translate = self.can_translate(jet);
        if can_translate {
            match jet {
                Jet::Left => self.position.0 += -1,
                Jet::Right => self.position.0 += 1,
                Jet::Down => self.position.1 += -1,
            }
        }
        can_translate
    }

    fn can_translate(&self, jet: &Jet) -> bool {
        let points = self.get_points();

        match jet {
            Jet::Left => points.into_iter().all(|Point(x, y)| !self.board.contains(&Point(x-1, y)) && x-1 >= 0),
            Jet::Right => points.into_iter().all(|Point(x, y)| !self.board.contains(&Point(x+1, y)) && x+1 < 7),
            Jet::Down => points.into_iter().all(|Point(x, y)| !self.board.contains(&Point(x, y-1)) && y-1 >= 0),
        }
    }

    fn write_piece(&mut self) {
        let points = self.get_points();
        for point in points.into_iter() {
            if point.1 as u64 > self.height {
                self.height = point.1 as u64;
            }
            self.board.insert(point);
        }
    }

    fn get_points(&self) -> HashSet<Point> {
        let Point(x, y) = self.position;
        match self.piece {
            Piece::Line => vec![Point(x, y), Point(x+1, y), Point(x+2, y), Point(x+3, y)].into_iter().collect::<HashSet<Point>>(),
            Piece::Plus => vec![Point(x, y+1), Point(x+1, y+1), Point(x+2, y+1), Point(x+1, y+2), Point(x+1, y)].into_iter().collect::<HashSet<Point>>(),
            Piece::Jay => vec![Point(x, y), Point(x+1, y), Point(x+2, y), Point(x+2, y+1), Point(x+2, y+2)].into_iter().collect::<HashSet<Point>>(),
            Piece::Stick => vec![Point(x, y), Point(x, y+1), Point(x, y+2), Point(x, y+3)].into_iter().collect::<HashSet<Point>>(),
            Piece::Box => vec![Point(x, y), Point(x+1, y), Point(x, y+1), Point(x+1, y+1)].into_iter().collect::<HashSet<Point>>(),
        }
    }

    fn tick(&mut self) {
        self.write_piece();
        self.tick_count += 1;
        self.position = Point(2, self.height as i32 + 4);
        self.piece = &self.pieces[self.tick_count as usize % self.pieces.len()];
    }
}

fn parse_data(path: &str) -> Vec<Jet> {
    let content = std::fs::read_to_string(path).unwrap();
    content.chars().map(|c| Jet::from_char(c).unwrap()).collect()
}

fn drop(max_drops: u64, board: &mut Board, jets: &Vec<Jet>) -> u64 {
    let mut jet: usize = 0;
    let mut memo: HashMap<(u64, usize), (u64, u64)> = HashMap::new();
    let mut added_height: u64 = 0;
    let mut drops = 0;
    while drops < max_drops {
        let sign = signature(board, jet % jets.len());
        if drops == 2022 {
            println!("Part 1: {}", board.height + 1);
        }
        if drops > 2022 && memo.contains_key(&sign) {
            let (old_drops, old_height) = memo.get(&sign).unwrap();
            let (dd, dh) = (drops - old_drops, board.height - old_height);
            let cycles = (max_drops - drops) / dd;
            drops += cycles * dd;
            added_height += cycles * dh;
        }
        memo.insert(sign, (drops, board.height));

        loop {
            // Blow
            board.translate(&jets[jet % jets.len()]); // Ignore whether translate is successful
            jet += 1;
            // Drop
            let ok = board.translate(&Jet::Down);
            if !ok {
                // Piece comes to rest
                board.tick();
                break;
            }
        }

        // Drop a piece
        drops += 1;
    };

    board.height + added_height + 1
}

fn signature(board: &Board, time: usize) -> (u64, usize) {
    let b = board.tick_count % board.pieces.len() as u64;
    return (b, time);
}

fn part_2(path: &str) {
    let drops: u64 = 1000000000000;
    let jets = parse_data(path);
    let mut board = Board::new();

    let height = drop(drops, &mut board, &jets);
    println!("Part 2: {}", height);
}

fn main() {
    let now = Instant::now();
    part_2("input.txt");
    let elapsed = now.elapsed();
    println!("Elapsed both pars: {:.2?}", elapsed);
}
const QUIZ_QUESTIONS = {
    'What is the name for the Jewish New Year?': {
        'Hanukkah': false,
        'Yom Kippur': false,
        'Kwanza': false,
        'Rosh Hashanah': true
    },
    'How many blue stripes are there on the U.S. flag?': {
        '6': false,
        '7': false,
        '13': false,
        '0': true
    },
    'Which one of these characters is not friends with Harry Potter?': {
        'Ron Weasley': false,
        'Neville Longbottom': false,
        'Draco Malfoy': true,
        'Hermione Granger': false
    },
    'What is the color of Donald Duck\'s bowtie?': {
        'Red': true,
        'Yellow': false,
        'Blue': false,
        'White': false
    },
    'What was the name of the band Lionel Richie was a part of?': {
        'King Harvest': false,
        'Spectrums': false,
        'Commodores': true,
        'The Marshall Tucker Band': false
    },
    'Which animal does not appear in the Chinese zodiac?': {
        'Dragon': false,
        'Rabbit': false,
        'Dog': false,
        'Hummingbird': true
    },
    'Which country held the 2016 Summer Olympics?': {
        'China': false,
        'Ireland': false,
        'Brazil': true,
        'Italy': false
    },
    'Which planet is the hottest?': {
        'Venus': true,
        'Saturn': false,
        'Mercury': false,
        'Mars': false
    },
    'Who was the only U.S. President to resign?': {
        'Herbert Hoover': false,
        'Richard Nixon': true,
        'George W. Bush': false,
        'Barack Obama': false
    },
    'What does the “D” in “D-Day” stand for?': {
        'Dooms': false,
        'Dark': false,
        'Day': true,
        'Dunkirk': false
    },
    'In which city can you find the Liberty Bell?': {
        'Washington, D.C.': false,
        'Boston': false,
        'Philadelphia': true,
        'Manhattan': false
    },
    'In Pirates of the Caribbean, what was Captain Jack Sparrow’s ship’s name?': {
        'The Marauder': false,
        'The Black Pearl': true,
        'The Black Python': false,
        'The Slytherin': false
    },
    'According to Forrest Gump, “life was like…”': {
        'A bag of lemons': false,
        'A handful of roses': false,
        'A lollipop': false,
        'A box of chocolates': true
    },
    'Linda and Bob from Bob’s Burgers have 3 kids. Which one of these characters is not one of them?': {
        'Louise': false,
        'Gene': false,
        'Jimmy': true,
        'Tina': false
    },
    'The British band One Direction (rip) was made up of Harry, Louis, Niall, Zayn, and…': {
        'Paul': false,
        'Callum': false,
        'Kevin': false,
        'Liam': true
    },
    'What is the rarest blood type?': {
        'O': false,
        'A': false,
        'B': false,
        'AB-Negative': true
    },
    'Holly Golightly is a character in which film?': {
        'Breakfast at Tiffanys': true,
        'Pretty In Pink': false,
        'Funny Face': false,
        'Singing In The Rain': false
    },
    'In The Wizard of Oz, the Tin Man wanted to see the Wizard about getting…': {
        'A brain': false,
        'An oil can': false,
        'A dog': false,
        'A heart': true
    },
    'Which U.S. state is known as the sunflower state?': {
        'Florida': false,
        'California': false,
        'Maine': false,
        'Kansas': true
    },
    'Which one of these characters isn’t a part of the Friends group?': {
        'Rachel': false,
        'Joey': false,
        'Gunther': true,
        'Monica': false
    },
    'How many bones are there in the human body?': {
        '206': true,
        '205': false,
        '201': false,
        '209': false
    },
    'Which famous singer released a song called “Adore You”?': {
        'Harry Styles': true,
        'Dua Lipa': false,
        'Halsey': false,
        'Shawn Mendes': false
    },
    'Fe is the chemical symbol for…': {
        'Zinc': false,
        'Hydrogen': false,
        'Fluorine': false,
        'Iron': true
    },
    'How old do you have to be to enter the hunger games?': {
        '12': true,
        '11': false,
        '10': false,
        '15': false
    },
    'What language is the most spoken worldwide?': {
        'Chinese': true,
        'Spanish': false,
        'Arabic': false,
        'English': false
    },
    'What year did Barbie come out?': {
        '1958': false,
        '1959': true,
        '1956': false,
        '1961': false
    },
    'What is Shakespeare’s shortest tragedy?': {
        'Macbeth': true,
        'Hamlet': false,
        'Romeo & Juliet': false,
        'Othello': false
    },
    'What is the #1 cookie in the U.S.?': {
        'Chips Ahoy!': false,
        'Milano': false,
        'Girl Scout Thin Mints': false,
        'Oreo': true
    },
    'How many hearts does an octopus have?': {
        '1': false,
        '2': false,
        '3': true,
        '4': false
    },
    'Who wrote The Scarlett Letter?': {
        'Shakespeare': false,
        'Stephen King': false,
        'Nathanial Hawthorne': true,
        'Ernest Hemingway': false
    },
    'Which social media platform came out in 2003?': {
        'Myspace': true,
        'Twitter': false,
        'Facebook': false,
        'Tumblr': false
    },
    'Which planet in our solar system is the largest?': {
        'Jupiter': true,
        'Saturn': false,
        'Neptune': false,
        'Earth': false
    },
    'The Powerpuff Girls are 3 distinct colors. What are they?': {
        'Red, yellow, green': false,
        'Yellow, blue, green': false,
        'Blue, green, red': true,
        'Green, purple, orange': false
    },
    'Which boyband sings the song “I Want It That Way”?': {
        'One Direction': false,
        'Backstreet Boys': true,
        'NSYNC': false,
        'New Kids On The Block': false
    },
    'Who painted the Sistine Chapel ceiling?': {
        'Picasso': false,
        'Da Vinci': false,
        'Michelangelo': true,
        'Van Gogh': false
    },
    'In which state did the Salem Witch Trials take place?': {
        'Washington': false,
        'Virginia': false,
        'Massachusetts': true,
        'Pennsylvania': false
    },
    'Which ocean is the largest?': {
        'Indian': false,
        'Pacific': true,
        'Atlantic': false,
        'Arctic': false
    },
    'Which New York City building is the tallest:': {
        'Empire State Building': false,
        'Bank of America Tower': false,
        'One World Trade Center': true,
        'Statue of Liberty': false
    },
    'What does the “E” in Chuck E. Cheese stand for?': {
        'Ernest': false,
        'Edward': false,
        'Entertainment': true,
        'Extra': false
    },
    'Which country gifted the Statue of Liberty to the U.S.?': {
        'Germany': false,
        'China': false,
        'France': true,
        'Italy': false
    },
    'Who painted the Mona Lisa?': {
        'Van Gogh': false,
        'da Vinci': true,
        'Picasso': false,
        'Monet': false
    },
    'In which city were Anne Frank and her family in hiding?': {
        'Paris': false,
        'Amsterdam': true,
        'Brussels': false,
        'Frankfurt': false
    },
    'There are 4 best friends on the TV show Pretty Little Liars: Hanna, Emily, Aria, and…': {
        'Mona': false,
        'Charlie': false,
        'Alison': false,
        'Spencer': true
    },
    'In which decade does the Netflix series Stranger Things take place?': {
        'the ‘70s': false,
        'the ‘80s': true,
        'the ‘90s': false,
        'the early 2000s': false
    },
    'Which country consumes the most chocolate?': {
        'Spain': false,
        'Germany': false,
        'North America': false,
        'Switzerland': true
    },
    'What is Sodium Chloride?': {
        'Salt': true,
        'Sugar': false,
        'Chlorine': false,
        'Bleach': false
    },
    'Which astrological sign is a crab?': {
        'Pisces': false,
        'Aquarius': false,
        'Cancer': true,
        'Virgo': false
    },
    'In the Bible, how does the Virgin Mary learn of her pregnancy with baby Jesus?': {
        'God tells her': false,
        'the angel Gabriel tells her': true,
        'she has a dream about it': false,
        'a doctor tells her': false
    },
    'Who, in the Harry Potter series, is Tom Riddle?': {
        'a student in Harry’s class': false,
        'a professor at Hogwarts': false,
        'Harry’s birth father': false,
        'Voldemort': true
    },
    'The movie The Social Network is about which social media platform:': {
        'Facebook': true,
        'Myspace': false,
        'Instagram': false,
        'Twitter': false
    },
    'Who wrote the songs for The Lion King?': {
        'Elton John': true,
        'Phil Collins': false,
        'Celine Dion': false,
        'Stevie Wonder': false
    },
    'How many daughters does Barack Obama have?': {
        '0': false,
        '1': false,
        '2': true,
        '3': false
    },
    'Which Disney princess sings “Just Around The Riverbend”?': {
        'Snow White': false,
        'Pocahontas': true,
        'Elsa': false,
        'Belle': false
    },
    'Which biblical narrative is connected to Palm Sunday?': {
        'Jesus’ entry into Jerusalem': true,
        'Jesus’ resurrection': false,
        'Jesus feeding the thousands': false,
        'Nothing, it just means to go to church on Sunday/the day of rest': false
    },
    'In Harry Potter and the Sorcerer’s Stone, who gives Harry the invisibility cloak?': {
        'Ron': false,
        'Snape': false,
        'Dumbledore': true,
        'No one; he just finds it': false
    },
    'How many boroughs are there in New York City?': {
        '4': false,
        '5': true,
        '6': false,
        '10': false
    },
    'In the U.S. version of The Office, Michael Scott burns his foot on:': {
        'hot water': false,
        'pavement/cement': false,
        'rocks on fire': false,
        'a George Foreman Grill': true
    },
    'The superstition believes that when the groundhog sees his shadow, it means:': {
        'early spring': false,
        '6 more weeks of winter': true,
        'it’s going to rain': false,
        'a tornado is coming': false
    },
    'What is the longest river in the world?': {
        'Amazon': false,
        'Congo': false,
        'Nile': true,
        'Hudson': false
    },
    'How many days are in February during a leap year?': {
        '28': false,
        '29': true,
        '30': false,
        '31': false
    },
    'How many degrees are in a circle?': {
        '360': true,
        '180': false,
        '150': false,
        '359': false
    },
    'Which city is known as the City of Love?': {
        'Rome': false,
        'Barcelona': false,
        'New York City': false,
        'Paris': true
    },
    'As an adult, how many teeth should you have in your mouth?': {
        '35': false,
        '32': true,
        '30': false,
        '42': false
    },
    'What was the name of the boy who won Willy Wonka’s factory?': {
        'Charlie Baxter': false,
        'Charlie Brown': false,
        'Charlie Bones': false,
        'Charlie Bucket': true
    },
    'Edward Scissorhands is known for cutting:': {
        'hair': false,
        'bushes': false,
        'clothes': false,
        'everything': true
    },
    'In which city would you find the Fisherman’s Bastion?': {
        'Rome': false,
        'Budapest': true,
        'Barcelona': false,
        'Athens': false
    },
    'Which U.S. president doesn’t/didn’t have a dog in the White House?': {
        'Trump': true,
        'Obama': false,
        'Bush': false,
        'Lincoln': false
    },
    'What does the “U” stand for in “UFO”?': {
        'Unidentified': true,
        'Under': false,
        'United': false,
        'Unique': false
    },
    'Which U.S. state is known as “America’s Dairyland”?': {
        'Minnesota': false,
        'Iowa': false,
        'Pennsylvania': false,
        'Wisconsin': true
    },
    'Usher found a young boy singing on YouTube and made him into a famous singer. What’s that kid’s name?': {
        'Niall Horan': false,
        'Jaden Smith': false,
        'Shawn Mendes': false,
        'Justin Bieber': true
    },
    'Which Olympic sport is Michael Phelps known for?': {
        'Snowboarding': false,
        'Skiing': false,
        'Running': false,
        'Swimming': true
    },
    'What is the complementary color of green?': {
        'blue': false,
        'yellow': false,
        'red': true,
        'purple': false
    },
    'Han Solo is a character from which movie series:': {
        'Harry Potter': false,
        'Star Wars': true,
        'Lord of the Rings': false,
        'Indiana Jones': false
    },
    'In Men and Black, what are the two FBI agents hunting?': {
        'serial killers': false,
        'ghosts': false,
        'aliens': true,
        'time travelers': false
    },
    'The most recent seasons of American Idol have the judges Katy Perry, Lionel Richie, and…': {
        'Trace Adkins': false,
        'Luke Bryan': true,
        'Blake Shelton': false,
        'Keith Urban': false
    },
    'How many Harry Potter books are there?': {
        '7': true,
        '8': false,
        '6': false,
        '10': false
    },
    'What breed of dog is the most popular in the U.S.?': {
        'Pug': false,
        'Dalmatian': false,
        'Beagle': false,
        'Golden Retriever': true
    },
    'Which rapper was known for his album Blue Slide Park?': {
        'J Cole': false,
        'Post Malone': false,
        'Eminem': false,
        'Mac Miller': true
    },
    'How many sides does a hexagon have?': {
        '5': false,
        '6': true,
        '7': false,
        '8': false
    },
    'In which city was Ferris Bueller’s Day Off filmed?': {
        'Pittsburgh': false,
        'Chicago': true,
        'NYC': false,
        'San Francisco': false
    },
    'The UK is made up of the following countries: England, Ireland, Wales, and…': {
        'France': false,
        'Hungary': false,
        'Scotland': true,
        'Austria': false
    },
    'How many elements are there on the periodic table?': {
        '112': false,
        '118': true,
        '120': false,
        '143': false
    },
    'Where is the United Nations Headquarters?': {
        'D.C.': false,
        'NYC': true,
        'Philadelphia': false,
        'Orlando': false
    },
    'What famous singer sings with Taylor Swift in her song “Me!”?': {
        'Brendan Urie': true,
        'Shawn Mendes': false,
        'Ellie Goulding': false,
        'Halsey': false
    },
    'In what year did women get the right to vote?': {
        '1910': false,
        '1920': true,
        '1930': false,
        '1940': false
    },
    'Where in the United States is the largest aquarium?': {
        'New Jersey': false,
        'Maine': false,
        'California': false,
        'Georgia': true
    },
    'There are 5 great lakes in the United States: Lake Michigan, Lake Superior, Lake Ontario, Lake Erie, and…': {
        'Lake Huron': true,
        'Lake Hartwell': false,
        'Lake Tahoe': false,
        'Great Bear Lake': false
    },
    'Neil Armstrong was the first man…': {
        'on Mars': false,
        'on a spacecraft alone': false,
        'on the Moon': true,
        'to travel to the sun': false
    },
    'What does “FBI” stand for?': {
        'Female Body Inspector': false,
        'Federal Bureau of Investigation': true,
        'Federal Business of Investigation': false,
        'Federal Bureau of Inspection': false
    },
    'What is the deadliest snake?': {
        'Python': false,
        'Cobra': false,
        'Black Mamba': true
    },
    'In The Office, what object of Dwight’s does Jim put in jello?': {
        'computer mouse': false,
        'wallet': false,
        'stapler': true,
        'coffee mug': false
    },
    'In Friends, how many times has Ross been married?': {
        'only once': false,
        '3 times': true,
        'twice': false,
        'more than 3 times': false
    },
    'What is a group of lions called?': {
        'Squad': false,
        'Pack': false,
        'Herd': false,
        'Pride': true
    },
    'How many keys are on a piano?': {
        '86': false,
        '87': false,
        '88': true,
        '89': false
    },
    'What was the name of the Greek mythological woman who had snakes for hair?': {
        'Pandora': false,
        'Helen': false,
        'Cassiopeia': false,
        'Medusa': true
    },
    'What do you call a baby goat?': {
        'Kid': true,
        'Goatee': false,
        'Child': false,
        'Baby Goat': false
    },
    'According to Phineas and Ferb, there are __ days of summer vacation?': {
        '90': false,
        '103': false,
        '104': true,
        '110': false
    },
    'What is the most populous city in Canada?': {
        'Toronto': true,
        'Ontario': false,
        'Quebec': false,
        'Vancouver': false
    },
    'The Da Vinci Code opens with a murder in which museum:': {
        'The Guggenheim': false,
        'The Louvre': true,
        'The Van Gogh museum': false,
        'The Metropolitan Museum of Art': false
    },
    'From which TV show is the family of Roses: Johnny, Moira, David, and Alexis?': {
        'Bob’s Burgers': false,
        'Schitt’s Creek': true,
        'Parenthood': false,
        '7th Heaven': false
    },
    'After The Simpsons,what is the longest-running TV show?': {
        'Law & Order': true,
        'Grey’s Anatomy': false,
        'Criminal Minds': false,
        'NCIS': false
    },
    'Which Disney princess sings “A Dream Is A Wish Your Heart Makes”?': {
        'Belle': false,
        'Cinderella': true,
        'Jasmine': false,
        'Sleeping Beauty': false
    },
    'How often does the moon orbit the Earth?': {
        'every 7 days': false,
        'every 27 days': true,
        'every 30 days': false,
        'every 365 days': false
    },
    'In Greek Mythology, who is the Queen of the Underworld?': {
        'Pandora': false,
        'Medusa': false,
        'Helen': false,
        'Persephone': true
    },
    'How many points are a touchdown worth?': {
        '5': false,
        '6': true,
        '7': false,
        '8': false
    },
    'How many feet are in a mile?': {
        '1,037': false,
        '5,288': false,
        '5,280': true,
        '6,201': false
    },
    'Where is the Oval Office located in the White House?': {
        'North Wing': false,
        'South Wing': false,
        'East Wing': false,
        'West Wing': true
    },
    'At what temperature (Fahrenheit) does water freeze?': {
        '32 degrees': true,
        '40 degrees': false,
        '-10 degrees': false,
        '0 degrees': false
    },
    'Where in Pennsylvania is The Office based?': {
        'Philadelphia': false,
        'Pittsburgh': false,
        'Scranton': true,
        'Lancaster': false
    },
    'In the movie Good Will Hunting, which college does Skylar attend?': {
        'Harvard': true,
        'Yale': false,
        'Columbia': false,
        'UCLA': false
    },
    'Where in California is Disneyland located?': {
        'Malibu': false,
        'Huntington Beach': false,
        'Los Angeles': false,
        'Anaheim': true
    },
    '“I see dead people” is a line from which horror film…': {
        'The Sixth Sense': true,
        'The Grudge': false,
        'The Shining': false,
        'The Exorcist': false
    },
    'Who founded Microsoft?': {
        'Bill Hader': false,
        'Steve Jobs': false,
        'Bill Gates': true,
        'Mark Zuckerberg': false
    },
    'In which city was the movie National Treasure filmed?': {
        'Washington D.C.': false,
        'NYC': false,
        'Philadelphia': true,
        'Roanoke': false
    },
    'Which classic novel has the line “Stay Gold, Ponyboy”?': {
        'The Catcher in the Rye': false,
        '1984': false,
        'The Outsiders': true,
        'Catch-22': false
    },
    'What was the name of Harry Potter’s pet owl?': {
        'Hedwig': true,
        'Luna': false,
        'Dobby': false,
        'Fluffy': false
    },
    'Which Disney princess had 3 fairy godmothers?': {
        'Cinderella': false,
        'Snow White': false,
        'Sleeping Beauty': true,
        'Jasmine': false
    },
    'Which band came back together in 2019?': {
        'The Naked Brothers Band': false,
        'The Jonas Brothers': true,
        'One Direction': false,
        'The Beatles': false
    },
    'Steve Jobs is known for wearing a black…': {
        'button-down shirt': false,
        't-shirt': false,
        'turtleneck': true,
        'blazer': false
    },
    'In which movie does Anne Hathaway play a poor, homeless woman?': {
        'The Devil Wears Prada': false,
        'Les Miserables': true,
        'The Princess Diaries': false,
        'Ella Enchanted': false
    },
    'The movie 10 Things I Hate About You was based on which play by Shakespeare:': {
        'Taming of the Shrew': true,
        'Hamlet': false,
        'Romeo and Juliet': false,
        'A Midsummer Night’s Dream': false
    },
    'Where does Nathan’s Hot Dog Eating Contest take place?': {
        'Coney Island': true,
        'Miami Beach': false,
        'Mall of America': false,
        'Orlando': false
    },
    'What age did Amy Winehouse, Janis Joplin, and Jimi Hendrix die?': {
        '26': false,
        '27': true,
        '29': false,
        '30': false
    },
    'Which two planets in our solar system are known as “ice giants”?': {
        'Neptune and Jupiter': false,
        'Uranus and Pluto': false,
        'Pluto and Jupiter': false,
        'Neptune and Uranus': true
    },
    'What country is Prague in?': {
        'Hungary': false,
        'Austria': false,
        'Czech Republic': true,
        'Germany': false
    },
    'What is the actress’s name in Funny Face, Sabrina, and Roman Holiday?': {
        'Audrey Hepburn': true,
        'Natalie Wood': false,
        'Marilyn Monroe': false,
        'Grace Kelly': false
    },
    'Which poet wrote the poem “The Raven”?': {
        'Robert Frost': false,
        'Edgar Allen Poe': true,
        'Walt Whitman': false,
        'Sylvia Plath': false
    },
    'How many ribs are in the human body?': {
        '16': false,
        '24': true,
        '19': false,
        '29': false
    },
    'Who was the 16th president of the United States?': {
        'Lincoln': true,
        'Nixon': false,
        'Jackson': false,
        'Madison': false
    },
    'Who wrote the novel Slaughterhouse-Five?': {
        'Kurt Vonnegut': true,
        'Stephen King': false,
        'J.D. Salinger': false,
        'Harper Lee': false
    },
    'In The Office, what was the food that Dwight grew on his farm?': {
        'pumpkins': false,
        'beets': true,
        'onions': false,
        'potatoes': false
    },
    'What animal is associated with ancient Egypt?': {
        'lion': false,
        'cat': true,
        'hummingbird': false,
        'rabbit': false
    },
    'In 2016, a musician won the Nobel Peace Prize for Literature. Who was it?': {
        'Lenny Kravitz': false,
        'Eric Clapton': false,
        'Bob Dylan': true,
        'Elton John': false
    },
    'How many time zones are there in the world?': {
        '7': false,
        '24': true,
        '23': false,
        '9': false
    },
    'What was the movie’s name that featured Matthew McConaughey, Michael Caine, Anne Hathaway, John Lithgow, and Matt Damon?': {
        'Flight Plan': false,
        'The Martian': false,
        'Interstellar': true,
        'Ad Astra': false
    },
    'How many rings are there in the Olympic symbol?': {
        '5': true,
        '7': false,
        '4': false,
        '9': false
    },
    'Twilight was both a book and a movie, with the main character Bella Swan being pulled into two different love directions with Edward Cullen and…': {
        'Jasper Hale': false,
        'Jacob Black': true,
        'Billy Black': false,
        'Dr. Cullen': false
    },
    'What is celebrated on December 26th?': {
        'the day after Christmas': false,
        'Harvest Day': false,
        'Boxing Day': true,
        'National Dog Day': false
    },
    'What is the name of the second American astronaut to step foot on the moon?': {
        'Buzz Aldrin': true,
        'Neil Armstrong': false,
        'Alan Bean': false,
        'James Irwin': false
    },
    'How many eyes does a spider have?': {
        '8': true,
        '9': false,
        '10': false,
        '2': false
    },
    'What is the first book of the Old Testament in the Bible?': {
        'Matthew': false,
        'Proverbs': false,
        'Genesis': true,
        'Exodus': false
    },
    'Which founding father is known for his large handwriting on the Declaration of Independence?': {
        'John Hancock': true,
        'Thomas Jefferson': false,
        'John Adams': false,
        'Alexander Hamilton': false
    },
    'What was the first Disney film that was produced in color?': {
        'Cinderella': false,
        'Snow White and the Seven Dwarfs': true,
        'Sleeping Beauty': false,
        'Pocahontas': false
    },
    'Sodium bicarbonate is used in the kitchen as what?': {
        'salt': false,
        'sugar': false,
        'baking soda': true,
        'vinegar': false
    },
    'In the 1983 movie National Lampoon’s Vacation, what is the name of the fictional amusement park the Griswold family is trying to go to?': {
        'Dorney Park': false,
        'Walley World': true,
        'Six Flags': false,
        'Dollywood': false
    },
    'In Ray Bradbury’s novel Fahrenheit 451, what are they burning?': {
        'clothes': false,
        'houses': false,
        'books': true,
        'money': false
    },
    'What was the first capital of the United States?': {
        'Washington, D.C.': false,
        'Richmond': false,
        'Boston': false,
        'Philadelphia': true
    },
    'Which actor performs music under the stage name Childish Gambino?': {
        'Donald Glover': true,
        'Will Smith': false,
        'Frank Ocean': false,
        'Tyler, The Creator': false
    },
    'Which water sport is the official sport for the state of Hawaii?': {
        'water polo': false,
        'swimming': false,
        'water skiing': false,
        'surfing': true
    },
    'In the movie The Princess Bride, what is Westley’s response to Buttercup’s requests?': {
        '“Okay.”': false,
        '“Of course, I love you.”': false,
        '“As you wish.”': true,
        '“Anything for you.”': false
    }
}

const TOTAL_QUESTIONS = Object.keys(QUIZ_QUESTIONS).length

function shuffle(array) {
    let currentIndex = array.length, randomIndex
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

terminal.addFunction("quiz", async function() {
    let numQuestions = 10 + Math.floor(Math.random() * 10)
    let questions = []
    terminal.printLine("welcome to the quiz!")
    await sleep(1000)
    terminal.printLine("let me prepare the questions...")
    await sleep(3000)
    while (questions.length < numQuestions) {
        let randomNum = Math.floor(Math.random() * TOTAL_QUESTIONS)
        if (questions.includes(randomNum)) continue
        questions.push(randomNum)
    }
    terminal.printLine("Let's start!\n")
    await sleep(500)
    let score = 0
    let userAnswers = []
    let questionAnswers = []
    for (let questionNum of questions) {
        let question = Object.keys(QUIZ_QUESTIONS)[questionNum]
        let answers = [...Object.keys(QUIZ_QUESTIONS[question])]
        let answerCheck = QUIZ_QUESTIONS[question]
        shuffle(answers)
        terminal.printLine(question)
        for (let i = 0; i < answers.length; i++) {
            terminal.printf`${{[Color.YELLOW]: i + 1}}: ${{[Color.WHITE]: answers[i]}}\n`
        }
        let inputNum = await terminal.promptNum(
            `Your answer [1-${answers.length}]: `,
            {min: 1, max: answers.length}
        ) - 1
        userAnswers.push(inputNum)
        questionAnswers.push(answers)
        terminal.printLine()
        if (answerCheck[answers[inputNum]]) score++
    }
    terminal.printLine("The quiz is finished!")
    await sleep(1000)
    terminal.print("Your score ")
    await sleep(2000)
    terminal.print("is ")
    await sleep(2000)
    terminal.print(score)
    await sleep(1000)
    terminal.printLine(`/${numQuestions}`)
    terminal.printLine(`that's ${~~(score / numQuestions * 100)}%. hope you had a good time!`)
    await sleep(2000)
    terminal.printLine("Your answers:\n")
    for (let i = 0; i < questions.length; i++) {
        let questionNum = questions[i]
        let question = Object.keys(QUIZ_QUESTIONS)[questionNum]
        let answers = questionAnswers[i]
        let answerCheck = QUIZ_QUESTIONS[question]
        let correctAnswer = answers.find(a => !!answerCheck[a])
        let answer = answers[userAnswers[i]]
        terminal.printLine(question)
        let answerColor = Color.LIGHT_GREEN
        if (!answerCheck[answer]) answerColor = Color.RED
        terminal.print("Your answer: ")
        terminal.print(answer, answerColor)
        if (!answerCheck[answer]) {
            terminal.print(". Correct answer: ")
            terminal.print(correctAnswer, Color.LIGHT_GREEN)
        }
        terminal.printLine(".\n")
    }
}, "play the quiz game")

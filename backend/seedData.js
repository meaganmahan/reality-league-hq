const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({
  region: "us-east-2",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function seedData() {
  // Seed Franchises
  const franchises = [
    { franchiseId: "RHOSLC", franchiseName: "Real Housewives of Salt Lake City" },
    { franchiseId: "RHOBH", franchiseName: "Real Housewives of Beverly Hills" },
    { franchiseId: "RHONY", franchiseName: "Real Housewives of New York" },
    { franchiseId: "RHOP", franchiseName: "Real Housewives of Potomac" },
  ];
  
  for (const franchise of franchises) {
    await dynamoDB
      .put({
        TableName: "Franchises",
        Item: franchise,
      })
      .promise();
    console.log(`Added franchise: ${franchise.franchiseName}`);
  }

  // Seed Players
  const players = [
    { playerId: "1", playerName: "Kyle Richards", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "2", playerName: "Erika Giardi", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "3", playerName: "Dorit Kemsley", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "4", playerName: "Garcelle Beauvais", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "5", playerName: "Sutton Stracke", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "6", playerName: "Bozoma Saint John", franchise: "Real Housewives of Beverly Hills", role: "Housewife" },
    { playerId: "7", playerName: "Ashley Darby", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "8", playerName: "Gizelle Bryant", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "9", playerName: "Karen Huger", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "10", playerName: "Kiearna Stewart", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "11", playerName: "Mia Thornton", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "12", playerName: "Stacey Rusch", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "13", playerName: "Wendy Osefo", franchise: "Real Housewives of Potomac", role: "Housewife" },
    { playerId: "14", playerName: "Angie Katsanevas", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "15", playerName: "Bronwynn Newport", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "16", playerName: "Heather Gay", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "17", playerName: "Lisa Barlow", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "18", playerName: "Mary Cosby", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "19", playerName: "Meredith Marks", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "20", playerName: "Whitney Rose", franchise: "Real Housewives of Salt Lake City", role: "Housewife" },
    { playerId: "21", playerName: "Brynn Whitfield", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "22", playerName: "Erin Lichy", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "23", playerName: "Jenna Lyons", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "24", playerName: "jessel_tank", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "25", playerName: "Raquel Chevremont", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "26", playerName: "Sai De Silva", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "27", playerName: "Ubah Hassan", franchise: "Real Housewives of New York City", role: "Housewife" },
    { playerId: "28", playerName: "PK", franchise: "Real Housewives of Beverly Hills", role: "Partner" },
    { playerId: "29", playerName: "Eddie Osefo", franchise: "Real Housewives of Potomac", role: "Partner" },
    { playerId: "30", playerName: "Gordon Thornton", franchise: "Real Housewives of Potomac", role: "Partner" },
    { playerId: "31", playerName: "Ray Huger", franchise: "Real Housewives of Potomac", role: "Partner" },
    { playerId: "32", playerName: "John Barlow", franchise: "Real Housewives of Salt Lake City", role: "Partner" },
    { playerId: "33", playerName: "Seth Marks", franchise: "Real Housewives of Salt Lake City", role: "Partner" },
    { playerId: "34", playerName: "Justin Rose", franchise: "Real Housewives of Salt Lake City", role: "Partner" },
    { playerId: "35", playerName: "Shawn Trujilo", franchise: "Real Housewives of Salt Lake City", role: "Partner" },
    { playerId: "36", playerName: "Todd Newport", franchise: "Real Housewives of Salt Lake City", role: "Partner" },
    { playerId: "37", playerName: "Abe Lichy", franchise: "Real Housewives of New York City", role: "Partner" },
    { playerId: "38", playerName: "David Craig", franchise: "Real Housewives of New York City", role: "Partner" },
    { playerId: "39", playerName: "Melissa Corpus", franchise: "Real Housewives of New York City", role: "Partner" },
    { playerId: "40", playerName: "Pavit Ranhawa", franchise: "Real Housewives of New York City", role: "Partner" },
    { playerId: "41", playerName: "Kathy Hilton", franchise: "Real Housewives of Beverly Hills", role: "Friend Of" },
    { playerId: "42", playerName: "Jennifer Tilly", franchise: "Real Housewives of Beverly Hills", role: "Friend Of" },
    { playerId: "43", playerName: "Jaqueline Blake", franchise: "Real Housewives of Potomac", role: "Friend Of" },
    { playerId: "44", playerName: "Britani Bateman", franchise: "Real Housewives of Salt Lake City", role: "Friend Of" },
    { playerId: "45", playerName: "Meili Workman", franchise: "Real Housewives of Salt Lake City", role: "Friend Of" },
    { playerId: "46", playerName: "Rebecca Minkoff", franchise: "Real Housewives of New York City", role: "Friend Of" },
  ];

  for (const player of players) {
    await dynamoDB
      .put({
        TableName: "Players",
        Item: player,
      })
      .promise();
    console.log(`Added player: ${player.playerName}`);
  }
}

seedData()
  .then(() => console.log("Data seeded successfully!"))
  .catch((err) => console.error("Error seeding data:", err));

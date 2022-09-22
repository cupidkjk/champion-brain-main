export const stats = [
	{
		title: "2 players mode",
		name: "two_player",
	},
	{
		title: "5 players mode",
		name: 'five_player',
	},
	{
		title: "Challenge mode",
		name: 'challenge',
	},
];

export const links = [
	{
		title: "Home",
		to: "/",
	},
	{
		title: "Rooms",
		to: "/rooms",
	},
	{
		title: "Wallet",
		to: "/wallet",
	},
	{
		title: "Admin",
		to: "/admin",
		admin: true,
	},
];

export const playNowLinks = [
	{
		title: "Create 3x",
		to: "/twoPlayer/3",
		roomType: 2
	},
	{
		title: "Create 4x",
		to: "/twoPlayer/4",
		roomType: 3
	},
	{
		title: "Create 5x",
		to: "/twoPlayer/5",
		roomType: 4
	},
];

export const settingLinks = [
	{
		title: "Buy Ticket",
		to: "/",
	},
	{
		title: "Send Ticket",
		to: "/",
	},
	{
		title: "Withdraw",
		to: "/",
	},
	{
		title: "Help",
		to: "/help",
	},
	{
		title: "Log out",
		to: "#",
	},
];

export const help = [
	{
		id: 0,
		title: "How to play?",
		nested: false,
		text: `
Set a number of your choice.
Wait for the opponent to select their number.
Guess the opponent's number and opponent will do the same other way around.
The game engine will compare the original number and the guessed number and counter it.
For example.

If opponent's number is 123 and player guesses 356.
In this case, the game engine will inform the player : Y0 N1.
Here, 3 exists in the original number but it's position is incorrect.
Hence, N is 1.

Now player guesses 528.
Game engine will inform : Y1 N0.
As 2 is in the correct position, Y is sent as 1.

The player who guesses the number first, wins.
		`,
	},
	{
		id: 1,
		title: "Game modes",
		nested: true,
		subItems: [
			{
				id: 0,
				title: "2-players mode game",
				text: `
There are 3 rooms: 3x, 4x and 5x room.
In 3x room players use a combination of 3 numbers and play one on one.
In 4x room players use a combination of 4 numbers and play one on one.
In 5x room players use a combination of 5 numbers and play one on one.
In order to join room, each player needs to pay for the tickets.
1 ticket price is 0.5$.

3x room : 1 ticket
4x room : 50 tickets
5x room : 200 tickets

After game, winner receive the tickets: 
3x - 1.5 tickets 
4x - 80 tickets
5x – 360 tickets
				`,
			},
			{
				id: 1,
				title: "5-players mode game",
				text: `
5 players take part in game together and have to guess the 5-digit number.

The 5 digit number will be random.
Each player inputs any 5-digit number he thinks.
Once all players input their numbers, 10 discriminants will be displayed at the same 
time.

From 10 discriminants, each player guesses the number.
Repeating this method, should be guess the number.
The player who is guessing the fastest gets winner.

This room tickets : 200 tickets.
Winner will be got 600 tickets.
				`,
			},
			{
				id: 2,
				title: "Challenge mode game",
				text: `
All members will have ranking order.
Due to this, from first to 10th players has permission that challenge can be got.
In order to challenge to these players, need tickets:

3x room : 3 tickets
4x room : 80 tickets
5x room : 250 tickets

If challenger win, challenger will receive tickets:

3x room : 2 tickets
4x room : 50 tickets
5x room : 200 tickets

If those who are challenged win, the player will receive tickets:

3x room : 2 tickets
4x room : 50 tickets
5x room : 180 tickets
				`,
			},
		],
	},
	{
		id: 2,
		title: "Ranking",
		nested: false,
		text: `
When the player wins in each game, the player gets the score.

2-players game : 
3x room : 1 score
4x room : 2 score
5x room : 3 score

Challenge game :
3x room : 3 score
4x room : 10 score
5x room : 20 score

5-players game :  30 score
		`,
	},
];

export const chatBoxRoutes = ['/rooms', '/twoPlayer/3', '/twoPlayer/4', '/twoPlayer/5'];
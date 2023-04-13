import { User } from '../../../User/entity/User.entity';

enum Result {
    WIN = 1,
    LOSE = 0,
    DRAW = 0.5
}

function checkMatch(users: Array<User>): { user0: User, user1: User } | undefined {
    //return user with the lowest difference in elo
    let user0 = undefined;
    let user1 = undefined;

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            if (user0 === undefined || user1 === undefined || Math.abs(users[i].elo - users[j].elo) < Math.abs(user0.elo - user1.elo)) {
                user0 = users[i];
                user1 = users[j];
            }
        }
    }
    if (user0 === undefined || user1 === undefined)
        return undefined;
    return { user0, user1 };
}

function probabilityWin(user: number, opp: number): number {
    return 1.0 / (1 + Math.pow(10, (opp - user) / 400));
}

function updateElo(user: number, opp: number, resultat: Result): number {
    const k = 32;
    const prob = probabilityWin(user, opp);
    console.log("elo: " + user + " prob: " + prob + " result: " + resultat);
    return user + k * (resultat - prob);
}

export { checkMatch, probabilityWin, updateElo, Result };
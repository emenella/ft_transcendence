import { User } from 'src/Users/entity/User.entity';

enum Result {
    WIN = 1,
    LOSE = 0,
    DRAW = 0.5
}

function checkMatch(users: Array<User>): { user0: User, user1: User } {
    //return user with the lowest difference in elo
    let user0: User = null;
    let user1: User = null;

    for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
            if (user0 === null || Math.abs(users[i].elo - users[j].elo) < Math.abs(user0.elo - user1.elo)) {
                user0 = users[i];
                user1 = users[j];
            }
        }
    }
    if (user0 === null || user1 === null)
        return null;
    return { user0, user1 };
}

function probabilityWin(user: User, opp: User): number {
    return 1.0 / (1 + Math.pow(10, (opp.elo - user.elo) / 400));
}

function updateElo(user: User, opp: User, resultat: Result): number {
    const k = 32;
    const prob = probabilityWin(user, opp);
    return user.elo + k * (resultat - prob);
}

export { checkMatch, probabilityWin, updateElo, Result };
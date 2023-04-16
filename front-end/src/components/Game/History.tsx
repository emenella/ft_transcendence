import React from "react";
import { Match, User, Avatar } from "../../utils/backend_interface"
import { getMatchs } from "../../api/User"

interface HistoryProps {
    User: User;
}



export default function History({User}: HistoryProps ) {
    const [history, setHistory] = React.useState<Match[]>([]);
    const [error, setError] = React.useState(null);
    const [user, setUser] = React.useState<User>(User);
    const [loading, setLoading] = React.useState(true);

    async function fetchHistory() {
        const res = await getMatchs(user.id).catch((e) => {
            setError(e);
            setLoading(false);
        });
        setHistory(res);
        setLoading(false);
        console.log(res);
    }

    React.useEffect(() => {
        fetchHistory();
    }, []);

    if (error) {
        return (<div>{error}</div>)
    }
    
    if (loading) {
        return (<div>Loading...</div>)
    }
    
    //Make a table with the history (Avatar 1, username 1, score 1, scrore 2, username 2, avatar 2)
    if (history.length === 0) {
        return (<div>No history</div>)
    }
    

    return (
        <div>
            <h1>History</h1>
            <table>
                {history.map((match) => (
                    <tr key={match.id}>
                        <td><img src={match.winner.avatar.path!} alt="avatar" /></td>
                        <td>{match.winner.username}</td>
                        <td>{match.scores[0]}</td>
                        <td>{match.scores[1]}</td>
                        <td>{match.looser.username}</td>
                        <td><img src={match.looser.avatar.path!} alt="avatar" /></td>
                    </tr>
                ))}
            </table>
        </div>
            
    )
}
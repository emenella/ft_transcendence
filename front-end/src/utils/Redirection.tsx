import { useNavigate } from "react-router-dom"

function Redirection(url: string) {
    const navigate = useNavigate();
    navigate(url);
}

export default Redirection;

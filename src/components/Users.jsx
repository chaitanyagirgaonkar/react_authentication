import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useRevalidator } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', { signal });
                const userNames = response.data.map(user => user.username)
                console.log(response.data);
                setUsers(userNames);
            } catch (err) {
                // Check if the error is due to cancellation
                if (err.name === 'CanceledError') {
                    console.log('Request canceled');
                } else {
                    console.error(err);
                    navigate('/login', { state: { from: location }, replace: true });
                }
            }
        };

        getUsers();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);

    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
    );
};

export default Users;

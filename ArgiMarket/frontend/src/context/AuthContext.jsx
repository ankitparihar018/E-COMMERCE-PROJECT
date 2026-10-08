import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getMe,
    login,
    logout,
    register
} from "../services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGetMe = async () => {

        try {

            const response = await getMe();

            if (response.data.success) {
                setUser(response.data.user);
            }

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        handleGetMe();
    }, []);

    const handleLogin = async (data) => {

        const response = await login(data);

        if (response.data.success) {
            setUser(response.data.user);
        }

        return response.data;
    };

    const handleRegister = async (data) => {

        const response = await register(data);

        if (response.data.success) {
            setUser(response.data.user);
        }

        return response.data;
    };

    const handleLogout = async () => {

        try {
            await logout();
        } catch (error) {
            console.log(error);
        }

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogin,
                handleRegister,
                handleLogout,
                handleGetMe
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
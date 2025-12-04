import { Outlet } from "react-router-dom";
import Layout from "./components/layout/layout";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin, App as AntApp, ConfigProvider } from "antd";
import "./App.css";

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchAccount = async () => {
            setAppLoading(true);
            
            // Kiểm tra token có tồn tại không
            const token = localStorage.getItem('access_token');
            if (!token) {
                // Không có token → chắc chắn chưa đăng nhập
                setAuth({
                    isAuthenticated: false,
                    user: { email: "", name: "", role: "" }
                });
                setAppLoading(false);
                return;
            }

            try {
                const res = await axios.get(`/v1/api/account`);
                if (res && !res.message) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            email: res.email,
                            name: res.name,
                            role: res.role || 'User'
                        }
                    });
                } else {
                    // API trả về lỗi hoặc không có data
                    setAuth({
                        isAuthenticated: false,
                        user: { email: "", name: "", role: "" }
                    });
                    // Clear token nếu không hợp lệ
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('rememberMe');
                }
            } catch (error) {
                // Not authenticated hoặc token hết hạn
                setAuth({
                    isAuthenticated: false,
                    user: { email: "", name: "", role: "" }
                });
                // Clear token khi nhận lỗi 401 hoặc token không hợp lệ
                if (error?.EC === 1 || error?.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('rememberMe');
                }
            } finally {
                setAppLoading(false);
            }
        };
        fetchAccount();
    }, []);

    return (
        <ConfigProvider
            theme={{
                token: {
                    zIndexBase: 1000,
                },
            }}
        >
            <AntApp>
                <div className="app-container">
                    {appLoading === true ? (
                        <div className="app-loading">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Layout>
                            <Outlet />
                        </Layout>
                    )}
                </div>
            </AntApp>
        </ConfigProvider>
    );
}

export default App;

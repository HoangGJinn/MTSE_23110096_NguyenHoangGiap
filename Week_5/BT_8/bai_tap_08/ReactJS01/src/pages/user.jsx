import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (!res?.message) {
                setDataSource(res);
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                });
            }
        }
        fetchUser();
    }, [])

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (role) => (
                <span style={{ 
                    color: role === 'Admin' ? '#ff4d4f' : '#1890ff',
                    fontWeight: 600
                }}>
                    {role}
                </span>
            )
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <h1 style={{ marginBottom: 24 }}>Quản lý tài khoản</h1>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
        </div>
    )
}

export default UserPage;

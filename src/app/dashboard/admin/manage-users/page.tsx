
import { getUsers } from '@/lib/api/services';
import React from 'react';

const ManageUsersPage = async () => {
    const users = await getUsers()
    console.log(users)
    return (
        <div>
            <h1>manage users</h1>
        </div>
    )
};

export default ManageUsersPage;
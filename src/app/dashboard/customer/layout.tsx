import React from 'react';
import { requireRole } from '@/lib/core/server';

const CustomerDashboadLayout = async({children}:{children: React.ReactNode}) => {
    await requireRole('customer')
    return children
};

export default CustomerDashboadLayout;
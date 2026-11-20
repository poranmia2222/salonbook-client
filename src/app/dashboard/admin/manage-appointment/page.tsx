import { getAppointment } from '@/lib/api/services';
import React from 'react';

const ManageAppointmentPage = async() => {
    const appointments = await getAppointment()
    console.log(appointments)
    return (
        <div>
            <h1>Manage Appointment: {appointments.length}</h1>
        </div>
    );
};

export default ManageAppointmentPage;
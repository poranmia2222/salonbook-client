import { getMyAppointments } from '@/lib/api/services';
import { getSession } from '@/lib/core/server';
import { Appointment } from '@/lib/types/service';
import React from 'react';

const MyAppointmentPage = async () => {
    const session = await getSession()
    const appointments: Appointment[] = await getMyAppointments(`applicantId=${session?.user.id}`);
    console.log(appointments)
    return (
        <div>
            <h1>My appointment</h1>
        </div>
    );
};

export default MyAppointmentPage;
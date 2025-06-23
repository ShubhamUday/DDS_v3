import React, { useEffect } from 'react'

const appoinmet_accept_reject = () => {
    const rejectController = async () => {
        const requestStatus = "Completed";
        //   settester(date)
        const values = { requestStatus }
        console.log(values)
        try {
            const result = await axios.put(`http://10.0.2.2:5000/update-Appointment-Details/${param1}`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(result.data)
            if (result.data) {
                getAllApointments()
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    const acceptController = async (id) => {
        const requestStatus = "Accepted";
        //   settester(date)
        const values = { requestStatus }
        console.log(values)
        try {
            const result = await axios.put(`http://10.0.2.2:5000/update-Appointment-Details/${id}`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(result.data)
            if (result.data) {
                getAllApointments()
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    useEffect = () => {
        acceptController()
        rejectController()
    }
    return (
        <div>appoinmet_accept_reject</div>
    )
}

export default appoinmet_accept_reject


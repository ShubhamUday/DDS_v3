import React from 'react'

const EditAppointmentFormModal = () => {

    
        const initialValues = () => {
            const data = selectedAppointment
            setFormData({
                doctorID: data?.doctorID || "",
                patientName: data?.userID?.name || data?.patientName || "",
                phone: data?.userID?.number || data?.phone || "",
                gender: data?.userID?.gender || data?.gender || "",
                age: data?.age || "",
                Weight: data?.Weight || "",
                treatmentFor: data?.treatmentFor || "",
                ProblemDetails: data?.ProblemDetails || "",
                diabetes: data?.diabetes || "",
                Bloodpressure: data?.Bloodpressure || "",
                plan: data?.plan || "",
                Bookdate: data?.Bookdate || "",
                BookTime: data?.BookTime || "",
                PayType: data?.PayType || "",
                clinicID: data?.clinicID || "",
            })
        }
         useEffect(() => {
                fetchClinicList();
                if(formType === "edit"){
                    initialValues()
                }
            }, []);
            
  return (
    <div>EditAppointmentFormModal</div>
  )
}

export default EditAppointmentFormModal
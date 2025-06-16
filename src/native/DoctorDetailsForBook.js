/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ToastAndroid, ActivityIndicator, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { REACT_APP_HOS } from '@env';

console.log(REACT_APP_HOS)

const getNext20Days = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 20; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const day = nextDate.getDate();
        const dayName = dayNames[nextDate.getDay()];
        dates.push(`${day}-${dayName}`);
    }

    return dates;
};


// Function to generate time intervals in 15-minute intervals in 12-hour AM/PM format

const DoctorDetailsForBook = ({ navigation, route }) => {
    const [doctorDetails, setdoctorDetails] = useState({})
    const [Schedulesdate, setSchedulesdate] = useState();
    const [availabletime, setAvailabletime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Bookdatenew, setBookdatenew] = useState(null);
    const [BookTimenew, setBookTimenew] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [Treatmentfor, setTreatmentfor] = useState('');
    const [Bookingfor, setBookingfor] = useState('');
    const [Plan, setPlan] = useState('In-Clinic');
    const [clinicdata, setClinicdata] = useState([]);
    const [ProblemDetails, setProblemDetails] = useState('');
    const [selectedplan, setSelectedplan] = useState('');
    const [gender, setGender] = useState('');
    const [age, setage] = useState(0);
    const [clinicID, setclinicID] = useState('');
    const [chatData, setchatData] = useState([]);
    const [intervallArray, setintervallArray] = useState([]);
    const [PayAmounOld, setPayAmounOld] = useState('500');
    const [PayStatus, setPayStatus] = useState('Pending');
    const [PayType, setPayType] = useState('Online');
    const [Emergency, setEmergency] = useState('No');
    const [singleClinic, setsingleClinic] = useState({})
    const [bookedSlots, setBookedSlots] = useState([]);

    // Validation error states
    const [ageError, setAgeError] = useState('');
    const [treatmentError, setTreatmentError] = useState('');
    const [problemError, setProblemError] = useState('');

    const next20Days = getNext20Days();


    const formatDateTime = (date) => {
        if (!date) return '';
        try {
            const formattedDate = moment(date).format('YYYY-MM-DD');
            console.log('Formatted date:', formattedDate);
            return formattedDate;
        } catch (error) {
            console.error('Date formatting error:', error);
            return '';
        }
    };

    const Bookdatr = formatDateTime(Bookdatenew, BookTimenew);
    console.log("SSNJKGJIVUI", moment(Bookdatr).format('DD-MM-YYYY'))


    const { param1 } = route.params;



    const extractHour = (timeString) => {
        // Split the time string into parts
        const [time, period] = timeString.split(' ');
        const [hour, minute] = time.split(':').map(Number);

        // Convert hour to 24-hour format if necessary
        let hour24 = period === 'PM' ? (hour % 12) + 12 : (hour % 12);

        // Adjust hour for midnight case
        if (period === 'AM' && hour === 12) {
            hour24 = 0;
        }

        return hour24;
    };











    const getBookedSlots = async (doctorID, date) => {
        try {
            const formattedDate = formatDateTime(date);
            if (!formattedDate) {
                console.error('Invalid date provided');
                return;
            }
            console.log('Fetching slots for:', doctorID, formattedDate);
            const response = await fetch(`https://dentalbackend-3gjq.onrender.com/get-booked-slots/${doctorID}/${formattedDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received data:', data);
            if (Array.isArray(data)) {
                setBookedSlots(data.map(appointment => appointment.BookTime));
              } else if (data.appointments) {
                setBookedSlots(data.appointments.map(appointment => appointment.BookTime));
              } else {
                setBookedSlots([]);
              }
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            setBookedSlots([]);
        }
    };

    const normalizeTime = (time) => time.trim().toLowerCase().replace(/\s+/g, '');


    const isSlotBooked = (time) => {
        return bookedSlots.map(normalizeTime).includes(normalizeTime(time));
    };

    const generateTimeIntervals = (dataObject) => {
        setsingleClinic(dataObject)
        setclinicID(dataObject._id)
        setEmergency('No')
        setPlan('')
        setBookTimenew(null)
        setPayAmounOld(dataObject.NormalFee)
        const time1 = dataObject.openTime;
        const time2 = dataObject.closeTime;

        const finalStarttime = extractHour(time1)
        const finalEndtime = extractHour(time2)
        console.log("jjgddddddddddddddddd", dataObject.NormalFee)
        const intervals = [];
        const startTime = new Date();
        startTime.setHours(finalStarttime, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(finalEndtime, 0, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const hours24 = currentTime.getHours();
            const hours12 = hours24 % 12 || 12;
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const ampm = hours24 < 12 ? 'AM' : 'PM';

            intervals.push({
                label: `${hours12}:${minutes} ${ampm}`,
                value: { hours: hours24, minutes: currentTime.getMinutes() },
            });

            currentTime.setMinutes(currentTime.getMinutes() + 15);
        }
        setintervallArray(intervals)
    };


















    const getsingleUser = async () => {
        try {
            const result = await axios.get(`https://dentalbackend-3gjq.onrender.com/get-single-doctor/${param1}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            setdoctorDetails(result.data)
            setClinicdata(result.data.clinicID)
            generateTimeIntervals(result.data.clinicID[0])
            console.log("jjg", result.data.clinicID)
        }
        catch (error) {
            console.log(error)
        }
    }




    const bookAppointmentFunction = async () => {
        const doctorID = param1;
        const userID = await AsyncStorage.getItem('userID');
        const Bookdate = formatDateTime(Bookdatenew, BookTimenew);
        const BookTime = availabletime;
        const PayAmount = parseFloat(PayAmounOld);

        // Reset all errors
        setAgeError('');
        setTreatmentError('');
        setProblemError('');

        if (!Bookingfor.trim() || !gender.trim() || !Plan.trim()) {
            ToastAndroid.showWithGravityAndOffset(
                'Please fill all details!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            return;
        }

        // Time validation
        if (!BookTime || !Bookdatenew) {
            ToastAndroid.showWithGravityAndOffset(
                'Please select an available time!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            return;
        }

        // Validation checks
        if (!age || age <= 0) {
            setAgeError('Please enter a valid age');
            return;
        }

        if (!Treatmentfor || Treatmentfor.trim() === '') {
            setTreatmentError('Please enter or select treatment');
            return;
        }

        if (!ProblemDetails || ProblemDetails.trim() === '') {
            setProblemError('Please describe your problem');
            return;
        }



        if (Bookingfor === "Other" && !patientName.trim()) {
            ToastAndroid.showWithGravityAndOffset(
                'Please enter patient name!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            return;
        }


        setIsLoading(true)

        const values = { Emergency, PayType, PayStatus, PayAmount, doctorID, userID, Bookdate, BookTime, Bookingfor, gender, age, patientName, Treatmentfor, ProblemDetails, clinicID, Plan }
        // console.log("kjdsbjkdg",BookTime)
        if (doctorID && userID && Bookdate && clinicID) {

            console.log("DONEEE");
            try {
                const result = await axios.post(`https://dentalbackend-3gjq.onrender.com/book-appointment`, values, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (result.data) {
                    console.log("DONEEE");
                    console.log(result.data);

                    ToastAndroid.showWithGravityAndOffset(
                        'Appointment booked sucsessfully!',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                    );
                    navigation.goBack()
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
            ToastAndroid.showWithGravityAndOffset(
                'Please choose an available date and time for the appointment!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
        }
    };

    const getAllChatList = async () => {

        try {
            const result = await axios.get(`https://dentalbackend-3gjq.onrender.com/get-one-doctor-all-rating/${param1}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            // console.log("data nnnnnnnn", result.data.ratingIDs)
            setchatData(result.data.ratingIDs)


        }
        catch (error) {
            console.log(error)
        }
    }


    const SingleRatingCounter = ({ chatData }) => {

        const sumRatingCount = chatData.reduce((total, item) => total + item.ratingCount, 0);

        const maxRatingCount = chatData.length * 5;
        const rawFinalRating = (sumRatingCount / maxRatingCount) * 5;

        // Round the final rating to the nearest whole number
        const ratingCountData = Math.round(rawFinalRating);

        return (<>
            <View style={styles.iconbox}>
                {ratingCountData === 1 || ratingCountData === 2 || ratingCountData === 3 || ratingCountData === 4 || ratingCountData === 5 ? <FontAwesome name='star' size={20} color='#ffbf00' style={{ marginRight: 5 }} /> : <FontAwesome name='star-o' size={20} color='#ffbf00' style={{ marginRight: 5 }} />}

                {ratingCountData === 2 || ratingCountData === 3 || ratingCountData === 4 || ratingCountData === 5 ? <FontAwesome name='star' size={20} color='#ffbf00' style={{ marginRight: 5 }} /> : <FontAwesome name='star-o' size={20} color='#ffbf00' style={{ marginRight: 5 }} />}

                {ratingCountData === 3 || ratingCountData === 4 || ratingCountData === 5 ? <FontAwesome name='star' size={20} color='#ffbf00' style={{ marginRight: 5 }} /> : <FontAwesome name='star-o' size={20} color='#ffbf00' style={{ marginRight: 5 }} />}

                {ratingCountData === 4 || ratingCountData === 5 ? <FontAwesome name='star' size={20} color='#ffbf00' style={{ marginRight: 5 }} /> : <FontAwesome name='star-o' size={20} color='#ffbf00' style={{ marginRight: 5 }} />}

                {ratingCountData === 5 ? <FontAwesome name='star' size={20} color='#ffbf00' /> : <FontAwesome name='star-o' size={20} color='#ffbf00' />}
            </View>
        </>);
    }

    const handleDateSelect = (item) => {
        try {
            const [day, dayName] = item.split('-');
            const today = new Date();
            const selectedDate = new Date(today.getFullYear(), today.getMonth(), parseInt(day));
            console.log('Selected date:', selectedDate);
            setBookdatenew(selectedDate);
            setShowTimePicker(true);
            setSchedulesdate(item);
            getBookedSlots(param1, selectedDate);
        } catch (error) {
            console.error('Error in handleDateSelect:', error);
        }
    };

    useEffect(() => {
        getsingleUser();
        getAllChatList();
    }, []);

    console.log('Booked Slots:', bookedSlots);

    return (
        <>
            <View style={styles.installmentheadbox}>
                <View style={styles.installmentheadtxtbox}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.installmentheadicon}><AntDesign name="arrowleft" size={23} color="white" /></TouchableOpacity>
                    <View>
                        <Text style={styles.installmentnamee}>Doctor Details</Text>
                    </View></View>
                {/* <View>
                    <AntDesign name="filter" size={23} color="white" /></View> */}
            </View>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.rediusborder}></View>
                <View style={styles.containertwo}>
                    <View style={styles.box}>
                        <View style={styles.imgbox}>
                            {/* <Image source={require('./assets/facebook-profile-picture-affects-chances-of-gettin_gstt.jpg')} style={styles.img_profile_two} /> */}
                            {doctorDetails.profile_url ? <Image style={styles.img_profile_two} source={{ uri: doctorDetails.profile_url }} /> : <View style={styles.logoprofile}><AntDesign name='user' size={55} color='white' /></View>}
                        </View>
                        <Text style={styles.text11}>{doctorDetails.drname}</Text>
                        <Text style={styles.text1}>{doctorDetails.designation}</Text>

                        <SingleRatingCounter chatData={chatData} />
                        <TouchableOpacity onPress={() => navigation.navigate("ReviewsDoctor", { param1: `${doctorDetails._id}` })}><Text style={styles.view_all_reviews}>view reviews</Text></TouchableOpacity>
                    </View>


                    <Text style={styles.text2}>Biography</Text>
                    <Text style={styles.text3}>{doctorDetails.biography}</Text>


                    <Text style={styles.text22}>Specialty</Text>
                    <View style={styles.flexbox}>
                        <View>
                            <Text style={styles.text4}>Years of experience</Text>
                            <Text style={styles.text4}>Patients checked</Text>
                        </View>
                        <View>
                            <Image source={require('./assets/senthesiss-scope.png')} style={styles.img} />
                        </View>
                        <View>
                            <Text style={styles.text5}>{doctorDetails.yearsofexperience} Years</Text>
                            <Text style={styles.text5}>{doctorDetails.patientchecked}+</Text>
                        </View>
                    </View>
                    <View style={styles.boxtwo}>
                        <Text style={styles.text22}>Booking For</Text>

                        <View style={styles.flexboxtwo}>

                            <TouchableOpacity style={[Bookingfor === "Self" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setBookingfor('Self') }}>
                                <Text style={[Bookingfor === "Self" ? styles.btntext : styles.btntexttwo]}>Self</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[Bookingfor === "Other" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setBookingfor('Other') }}>
                                <Text style={[Bookingfor === "Other" ? styles.btntext : styles.btntexttwo]}>Other</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {Bookingfor === "Other" && <TextInput placeholder='Name' placeholderTextColor={'#b0b0b0'} style={styles.input}
                        value={patientName} onChangeText={(text) => setPatientName(text)}
                    />}

                    <Text style={styles.text22}>Gender</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[gender === "Male" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setGender('Male') }}>
                            <Text style={[gender === "Male" ? styles.btntext : styles.btntexttwo]}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[gender === "Female" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setGender('Female') }}>
                            <Text style={[gender === "Female" ? styles.btntext : styles.btntexttwo]}>Female</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.text22}>Age</Text>
                    <TextInput placeholder='Enter age here..' placeholderTextColor={'#b0b0b0'} style={[styles.input, ageError ? styles.inputError : null]} keyboardType='numeric'
                        value={age} onChangeText={(text) => {
                            setage(text);
                            setAgeError('');
                        }}
                    />
                    {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

                    <Text style={styles.text22}>Treatment for</Text>
                    <TextInput placeholder='Enter Disease or select from below' placeholderTextColor={'#b0b0b0'} style={[styles.input, treatmentError ? styles.inputError : null]}
                        value={Treatmentfor} onChangeText={(text) => {
                            setTreatmentfor(text);
                            setTreatmentError('');
                        }}
                    />
                    {treatmentError ? <Text style={styles.errorText}>{treatmentError}</Text> : null}

                    <View style={styles.flexboxtwo}>
                        <TouchableOpacity style={[Treatmentfor === "Tooth Pain" ? styles.clickbtnthree : styles.btnthree]} onPress={() => setTreatmentfor('Tooth Pain')} >
                            <Text style={[Treatmentfor === "Tooth Pain" ? styles.btntext : styles.btntexttwo]}>Tooth Pain</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Treatmentfor === "Braces" ? styles.clickbtnthree : styles.btnthree]} onPress={() => setTreatmentfor('Braces')}>
                            <Text style={[Treatmentfor === "Braces" ? styles.btntext : styles.btntexttwo]}>Braces</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Treatmentfor === "Crown" ? styles.clickbtnthree : styles.btnthree]} onPress={() => setTreatmentfor('Crown')}>
                            <Text style={[Treatmentfor === "Crown" ? styles.btntext : styles.btntexttwo]}>Crown</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Treatmentfor === "Bridges" ? styles.clickbtnthree : styles.btnthree]} onPress={() => setTreatmentfor('Bridges')}>
                            <Text style={[Treatmentfor === "Bridges" ? styles.btntext : styles.btntexttwo]}>Bridges</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[Treatmentfor === "Toot ache" ? styles.clickbtnthree : styles.btnthree]} onPress={() => setTreatmentfor('Toot ache')}>
                            <Text style={[Treatmentfor === "Toot ache" ? styles.btntext : styles.btntexttwo]}>Toot ache</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.text2}>Problem</Text>
                    <TextInput placeholder='Describe about your disease or problem' placeholderTextColor={'#b0b0b0'} multiline={true} numberOfLines={4} style={[styles.input2, problemError ? styles.inputError : null]}
                        value={ProblemDetails} onChangeText={(text) => {
                            setProblemDetails(text);
                            setProblemError('');
                        }}
                    />
                    {problemError ? <Text style={styles.errorText}>{problemError}</Text> : null}

                    <Text style={styles.text22}>Clinic</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >

                        {clinicdata?.map((e, id) => <TouchableOpacity style={[clinicID === e._id ? styles.clickboxx : styles.boxx]} onPress={() => generateTimeIntervals(e)} >
                            <View style={styles.flex_for_image_div}>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Image source={{ uri: e.imgarry[0]?.profile_url }} style={styles.imgthree} />
                                    <TouchableOpacity onPress={() => navigation.navigate("ClinicWithDetails", { param1: `${e._id}` })} ><Text style={[styles.view_all_reviews, { marginTop: 12 }]}>view details</Text></TouchableOpacity></View>
                                <View>
                                    <View style={styles.icon_text_div}>
                                        <FontAwesome5 name="clinic-medical" size={20} color={'#C2C2C2'} />
                                        <Text style={styles.client_name_text}> {e.clinicname}</Text>
                                    </View>
                                    <View style={styles.icon_text_div}>
                                        <MaterialCommunityIcons name="map-marker-radius-outline" size={23} color={'#C2C2C2'} />
                                        <Text style={styles.address_text}> {e.clinicAddress}</Text>
                                    </View>
                                    <View style={styles.icon_text_div}>
                                        <MaterialIcons name="call" size={23} color={'#C2C2C2'} />
                                        <Text style={styles.address_text}> 9856447412</Text>
                                    </View>
                                    <View style={styles.icon_text_div}>
                                        <MaterialCommunityIcons name="clock-time-ten-outline" size={23} color={'#C2C2C2'} />
                                        <Text style={styles.address_text}> Open Time  : <Text>{e.openTime}</Text></Text>
                                    </View>
                                    <View style={styles.icon_text_div}>
                                        <MaterialCommunityIcons name="clock-time-eight-outline" size={23} color={'#C2C2C2'} />
                                        <Text style={styles.address_text}> Close Time  : <Text>{e.closeTime}</Text></Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>)}

                    </ScrollView>





                    <Text style={[styles.text22]}>Appointment type</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[Emergency === "No" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setEmergency('No'); setPlan('In-Clinic'); setPayAmounOld(singleClinic.NormalFee) }}>
                            <Text style={[Emergency === "No" ? styles.btntext : styles.btntexttwo]}>Normal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[Emergency === "Yes" ? styles.cliEmergency : styles.btntwo]} onPress={() => { setEmergency('Yes'); setPlan('In-Clinic'); setPayAmounOld(singleClinic.EmergencyFee) }}>
                            <Text style={[Emergency === "Yes" ? styles.btntext : styles.btntexttwo]}>Emergency</Text>
                        </TouchableOpacity>

                    </View>













                    {Emergency === "No" && <>
                        <Text style={styles.text22}>Plan</Text>

                        <View style={styles.flexboxtwo}>

                            <TouchableOpacity style={[Plan === "Online" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPlan('Online'); setPayAmounOld(singleClinic.MassageFee); setSelectedplan('Messaging') }}>
                                <Text style={[Plan === "Online" ? styles.btntext : styles.btntexttwo]}>Online</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[Plan === "In-Clinic" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPlan('In-Clinic'); setPayAmounOld(singleClinic.NormalFee) }}>
                                <Text style={[Plan === "In-Clinic" ? styles.btntext : styles.btntexttwo]}>In-Clinic</Text>
                            </TouchableOpacity>
                        </View>
                        <Text></Text>
                        {Plan === "Online" && <View>
                            <TouchableOpacity onPress={() => { setSelectedplan('Messaging'); setPayAmounOld(singleClinic.MassageFee) }} style={[selectedplan === "Messaging" ? styles.clickflexbtn : styles.flexbtn]}>
                                <AntDesign name='message1' size={30} color='#25408f' />
                                <View style={{ marginLeft: 10, width: '88%' }}>
                                    <View style={styles.flexbox}>
                                        <Text style={styles.daytext}>Messaging</Text>
                                        <Text style={styles.daytext}>{singleClinic.MassageFee}₹</Text>
                                    </View>
                                    <View style={styles.flexbox}>
                                        <Text style={{ color: '6A6A6A' }}>chats with doctors</Text>
                                        <Text style={{ color: '6A6A6A' }}>15 min</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { setSelectedplan('Video call'); setPayAmounOld(singleClinic.CallFee) }} style={[selectedplan === "Video call" ? styles.clickflexbtn : styles.flexbtn]}>
                                <Feather name='video' size={30} color='#25408f' />
                                <View style={{ marginLeft: 10, width: '88%' }}>
                                    <View style={styles.flexbox}>
                                        <Text style={styles.daytext}>Video call</Text>
                                        <Text style={styles.daytext}>{singleClinic.CallFee}₹</Text>
                                    </View>
                                    <View style={styles.flexbox}>
                                        <Text style={{ color: '6A6A6A' }}>Video chat with doctors</Text>
                                        <Text style={{ color: '6A6A6A' }}>15 min</Text>
                                    </View>

                                </View>

                            </TouchableOpacity>
                        </View>
                        }
                    </>}


























                    <Text style={styles.text2}>Schedules</Text>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={next20Days}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[Schedulesdate === item ? styles.datebox_color : styles.datebox]}
                                onPress={() => handleDateSelect(item)}
                            >
                                <Text style={[Schedulesdate === item ? styles.daytext_color : styles.daytext]} >{item.slice(0, 2).split('-') > 9 ? item.slice(2, 6).split('-') : item.slice(2, 5).split('-')}</Text>
                                <Text style={[Schedulesdate === item ? styles.datetext_color : styles.datetext]}>{item.slice(0, 2).split('-')}</Text>
                            </TouchableOpacity>
                        )}
                    />



                    {showTimePicker && (
                        <>
                            <Text style={styles.text2}>Available time</Text>
                            <ScrollView style={styles.scrollView} horizontal showsHorizontalScrollIndicator={false}>
                                {intervallArray.map((interval, index) => {
                                    const isBooked = isSlotBooked(interval.label);
                                    console.log('Checking slot:', interval.label, 'Booked:', isSlotBooked(interval.label));

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.timebox,
                                                availabletime === interval.label && styles.clicktimebox,
                                                isBooked && styles.bookedSlot
                                            ]}
                                            onPress={() => {
                                                if (!isBooked) {
                                                    setBookTimenew(interval.value);
                                                    setAvailabletime(interval.label);
                                                }
                                            }}
                                            disabled={isBooked}
                                        >
                                            <View style={styles.timeSlotContent}>
                                                <Text style={[
                                                    availabletime === interval.label ? styles.timetext_color : styles.daytext,
                                                    isBooked && styles.bookedSlotText,
                                                    isBooked && { textDecorationLine: 'line-through', fontWeight: 'bold' }
                                                ]}>
                                                    {interval.label}
                                                </Text>
                                                {isBooked && (
                                                    <View style={styles.bookedIndicator}>
                                                        <AntDesign name="lock" size={16} color="#fff" style={{ marginRight: 4 }} />
                                                        <Text style={[styles.bookedIndicatorText, { fontSize: 14, fontWeight: 'bold' }]}>Booked</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                        </>
                    )}







                    <Text style={[styles.text22, { marginTop: 16 }]}>Payment</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[PayStatus === "Paid" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Paid') }}>
                            <Text style={[PayStatus === "Paid" ? styles.btntext : styles.btntexttwo]}>Pay Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[PayStatus === "Pending" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Pending') }}>
                            <Text style={[PayStatus === "Pending" ? styles.btntext : styles.btntexttwo]}>In-Clinic</Text>
                        </TouchableOpacity>

                    </View>















                    <Text style={styles.text22}>Amount : {PayAmounOld}₹</Text>



















                    <TouchableOpacity style={styles.btn}
                        onPress={bookAppointmentFunction}
                        disabled={isLoading}
                    >{isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.btntext}>Book Appointment</Text>
                    )}

                    </TouchableOpacity>
                </View>

            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#25408f'
    },
    containertwo: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        backgroundColor: '#fff',
        padding: 16
    },
    boxx: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 12,
        // marginHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderColor: '#C7C7C7',
        borderWidth: 1,
        marginTop: 8,
        marginRight: 12
    },
    clickboxx: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 12,
        // marginHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderColor: '#ff914d',
        borderWidth: 1,
        marginTop: 8,
        marginRight: 12
    },
    client_name_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Medium',
        fontSize: 15
    },
    address_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Medium',
    },
    icon_text_div: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        width: 250
    },
    imgthree: {
        width: 120,
        height: 140,
        marginRight: 12,
        borderRadius: 8
    },
    flex_for_image_div: {
        flexDirection: 'row',

    },
    flex_for_icon_div: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flexbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderColor: '#d7d7d7',
        marginBottom: 16
    },
    clickflexbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderColor: '#ff914d',
        marginBottom: 16
    },
    btnthree: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 16,
        marginRight: 8,
        borderColor: '#d7d7d7',
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center'
    },
    clickbtnthree: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 16,
        marginRight: 8,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: '#ff914d'
    },
    clickbtntext: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 16
    },
    flexboxtwo: {
        flexDirection: 'row',
        // justifyContent:'space-between',
        flexWrap: 'wrap'
    },
    input: {
        // paddingHorizontal: 4,
        fontSize: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        paddingHorizontal: 12,

        marginBottom: 16,
        marginTop: 8
    },
    input2: {
        fontSize: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        paddingHorizontal: 12,

        marginBottom: 16,
        // marginTop: 8,
        textAlignVertical: 'top'
    },
    btntexttwo: {
        color: '#25408f',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
    btntwo: {
        borderWidth: 1,
        alignItems: 'center',
        width: '27%',
        marginRight: 12,
        paddingVertical: 12,
        marginTop: 8,
        //    marginBottom:16,
        borderRadius: 16,
        borderColor: '#d7d7d7',
    },
    clickbtntwo: {
        alignItems: 'center',
        width: '27%',
        marginRight: 12,
        paddingVertical: 12,
        marginTop: 8,
        //    marginBottom:16,
        borderRadius: 16,
        backgroundColor: '#ff914d'
    },
    cliEmergency: {
        alignItems: 'center',
        width: '27%',
        marginRight: 12,
        paddingVertical: 12,
        marginTop: 8,
        //    marginBottom:16,
        borderRadius: 16,
        backgroundColor: '#E20000'
    },

    flexdate: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btn: {
        paddingVertical: 16,
        marginBottom: 16,
        marginTop: 32,
        backgroundColor: '#25408f',
        borderRadius: 16,
        alignItems: 'center'
    },
    btntext: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 16
    },
    datetext: {
        color: '#132F4D',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginTop: 8
    },
    daytext: {
        color: '#132F4D',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    daytext_color: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    datetext_color: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginTop: 8
    },
    datebox: {
        // paddingHorizontal: 10,
        // paddingVertical: 16,
        width: 47,
        height: 75,
        borderWidth: 1,
        borderRadius: 14,
        borderColor: '#d7d7d7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginBottom: 16
    },
    datebox_color: {
        width: 47,
        height: 75,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#ff914d'
    },
    timetext_color: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    clicktimebox: {
        backgroundColor: '#ff914d',
        borderColor: '#ff914d',
    },
    timebox: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#d7d7d7',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    img: {
        height: 100
    },
    boxtwo: {
        marginTop: -15,
        marginBottom: 16
    },
    text4: {
        color: '#132F4D',
        fontSize: 16,
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
    },
    text5: {
        color: '#132F4D',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        marginTop: 8,
        textAlign: 'right'
    },
    flexbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    linktext: {
        color: '#132F4D',
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
    },
    box: {
        alignItems: 'center'
    },
    iconbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        width: '40%',
        marginBottom: 16
    },
    text11: {
        fontSize: 20,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',

    },
    view_all_reviews: {
        fontSize: 13,
        // fontWeight:'900',
        color: '#06aeeb',
        fontFamily: 'Poppins-Medium',
        borderBottomWidth: 1,
        borderBottomColor: '#06aeeb',

    },
    text1: {
        fontSize: 15,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',

    },
    text2: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        marginBottom: 10
    },
    text22: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
    },
    text3: {
        color: '#132F4D',
        fontSize: 15,
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    imgbox: {
        marginTop: -55,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 100
    },
    img_profile_two: {
        height: 110,
        width: 110,
        borderRadius: 250,
        marginBottom: 12
    },
    logoprofile: {
        height: 110,
        width: 110,
        borderRadius: 250,
        marginBottom: 12,
        backgroundColor: '#D7D7D7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    installmentheadbox: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: 15,
        backgroundColor: '#25408f',

        // paddingHorizontal: 16,
    },
    installmentheadtxtbox: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    installmentnamee: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-Medium'
    },
    installmentheadicon: {
        padding: 16
    },
    rediusborder: {
        backgroundColor: '#25408f',
        height: 60,
        // borderBottomLeftRadius: 25,
        // borderBottomRightRadius: 25
    },
    inputError: {
        borderColor: '#ff0000',
        borderWidth: 1,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
        marginLeft: 12,
        fontFamily: 'Poppins-Regular'
    },
    bookedSlot: {
        backgroundColor: '#ff6b6b',
        borderColor: '#ff6b6b',
        opacity: 0.8,
    },
    timeSlotContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // minWidth: 100,
    },
    bookedIndicator: {
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
        flexDirection:'row'
    },
    bookedIndicatorText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
    },
    bookedSlotText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
})

export default DoctorDetailsForBook

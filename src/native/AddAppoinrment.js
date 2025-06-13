/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ToastAndroid, ActivityIndicator, FlatList, TextInput, ImageBackground } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
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

const AddAppointment = ({ navigation, route }) => {
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
    const [selectedplan, setSelectedplan] = useState('Messaging');
    const [gender, setGender] = useState('Male');
    const [age, setage] = useState(0);
    const [Weight, setWeight] = useState(0);
    const [clinicID, setclinicID] = useState('');
    const [chatData, setchatData] = useState([]);
    const [diabetes, setdiabetes] = useState('No');
    const [Bloodpressure, setBloodpressure] = useState('No');
    const [intervallArray, setintervallArray] = useState([]);
    const [PayAmounOld, setPayAmounOld] = useState('500');
    const [PayStatus, setPayStatus] = useState('Pending');
    const [PayType, setPayType] = useState('Case');


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




    // Function to generate time intervals in 15-minute intervals in 12-hour AM/PM format
    const generateTimeIntervals = (dataObject) => {
        setclinicID(dataObject._id)

        const time1 = dataObject.openTime;
        const time2 = dataObject.closeTime;

        const finalStarttime = extractHour(time1)
        const finalEndtime = extractHour(time2)

        const intervals = [];
        const startTime = new Date();
        startTime.setHours(finalStarttime, 0, 0, 0); // Start at 11:00 AM

        const endTime = new Date();
        endTime.setHours(finalEndtime, 0, 0, 0); // End at 10:00 PM

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const hours24 = currentTime.getHours();
            const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const ampm = hours24 < 12 ? 'AM' : 'PM';

            intervals.push({
                label: `${hours12}:${minutes} ${ampm}`,
                value: { hours: hours24, minutes: currentTime.getMinutes() },
            });

            // Move to the next interval
            currentTime.setMinutes(currentTime.getMinutes() + 15);
        }
        setintervallArray(intervals)
        // return intervals;
    };

    const next20Days = getNext20Days();
    // const timeIntervals = generateTimeIntervals();

    const formatDateTime = (date, time) => {
        if (!date || !time) return '';
        const dateTime = new Date(date);
        dateTime.setHours(time.hours, time.minutes, 0, 0);
        return dateTime.toISOString();
    };

    const Bookdatr = formatDateTime(Bookdatenew, BookTimenew);
    console.log("SSNJKGJIVUI", moment(Bookdatr).format('DD-MM-YYYY'))


    const { param1 } = route.params;

    const getsingleUser = async () => {
        try {
            const result = await axios.get(`https://dentalbackend-3gjq.onrender.com/get-single-doctor/${param1}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            setdoctorDetails(result.data)
            setClinicdata(result.data.clinicID)
            setclinicID(result.data.clinicID[0]._id)
            generateTimeIntervals(result.data.clinicID[0])

        }
        catch (error) {
            console.log(error)
        }
    }

    const bookAppointmentFunction = async () => {

        const doctorID = param1;

        const Bookdate = formatDateTime(Bookdatenew, BookTimenew);
        const BookTime = availabletime;

        const PayAmount = parseFloat(PayAmounOld);
        const requestStatus = "Accepted";
        const values = { PayType, PayStatus, PayAmount, requestStatus, doctorID, Bookdate, Weight, BookTime, gender, age, patientName, Treatmentfor, ProblemDetails, clinicID, Plan, diabetes, Bloodpressure }
        console.log("kjdsbjkdg", values)


        if (!gender.trim() || !Treatmentfor.trim() || !ProblemDetails.trim() || !Plan.trim()) {
            ToastAndroid.showWithGravityAndOffset(
                'Please provide all details!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            return;
        }

        if (!patientName.trim()) {
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
        if (doctorID && Bookdate && clinicID) {

            console.log("DONEEE");
            try {
                const result = await axios.post(`https://dentalbackend-3gjq.onrender.com/book-appointment-without-user`, values, {
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

    useEffect(() => {
        getsingleUser();
    }, []);


    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={require('../assets/ImageMay9202509_11_02PM.png')}
                    style={styles.imNg}

                >
                    <View style={styles.installmentheadbox}>
                        <View style={styles.installmentheadtxtbox}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.installmentheadicon}>
                                <AntDesign name="arrowleft" size={24} color="white" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.installmentnamee}>Book Appointment</Text>
                            </View></View>
                        {/* <View>
                    <AntDesign name="filter" size={23} color="white" /></View> */}
                    </View></ImageBackground>
                <View style={styles.rediusborder}></View>
                <View style={styles.containertwo}>
                    <View style={styles.box}>
                        <View style={styles.imgbox}>
                            {/* <Image source={require('./assets/facebook-profile-picture-affects-chances-of-gettin_gstt.jpg')} style={styles.img_profile_two} /> */}
                            {doctorDetails.profile_url ? <Image style={styles.img_profile_two} source={{ uri: doctorDetails.profile_url }} /> : <View style={styles.logoprofile}><AntDesign name='user' size={55} color='white' /></View>}
                        </View>
                        <Text style={styles.text11}>{doctorDetails.drname}</Text>
                        <Text style={styles.text1}>{doctorDetails.designation}</Text>
                    </View>

                    <Text style={styles.text22}>Name</Text>
                    <TextInput placeholder='Name' placeholderTextColor={'#b0b0b0'} style={styles.input}
                        value={patientName} onChangeText={(text) => setPatientName(text)}
                    />

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
                    <TextInput placeholder='Enter age here..' placeholderTextColor={'#b0b0b0'} style={styles.input} keyboardType='numeric'
                        value={age} onChangeText={(text) => setage(text)}
                    />




                    <Text style={styles.text22}>Weight</Text>
                    <TextInput placeholder='Enter weight here..' placeholderTextColor={'#b0b0b0'} style={styles.input} keyboardType='numeric'
                        value={Weight} onChangeText={(text) => setWeight(text)}
                    />

                    <Text style={styles.text22}>Treatment for</Text>
                    <TextInput placeholder='Enter Disease or select from below' placeholderTextColor={'#b0b0b0'} style={styles.input}
                        value={Treatmentfor} onChangeText={(text) => setTreatmentfor(text)}
                    />
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
                    <TextInput placeholder='Describe about disease or problem' placeholderTextColor={'#b0b0b0'} multiline={true} numberOfLines={4} style={styles.input2}
                        value={ProblemDetails} onChangeText={(text) => setProblemDetails(text)}
                    />

                    <Text style={styles.text22}>Clinic</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >

                        {clinicdata?.map((e, id) => <TouchableOpacity style={[clinicID === e._id ? styles.clickboxx : styles.boxx]} onPress={() => generateTimeIntervals(e)} >
                            <View style={styles.flex_for_image_div}>
                                <Image source={{ uri: e.imgarry[0]?.profile_url }} style={styles.imgthree} />
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

                    <Text style={styles.text22}>Diabetes</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[diabetes === "Yes" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setdiabetes('Yes') }}>
                            <Text style={[diabetes === "Yes" ? styles.btntext : styles.btntexttwo]}>Yes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[diabetes === "No" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setdiabetes('No') }}>
                            <Text style={[diabetes === "No" ? styles.btntext : styles.btntexttwo]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[diabetes === "Pre" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setdiabetes('Pre') }}>
                            <Text style={[diabetes === "Pre" ? styles.btntext : styles.btntexttwo]}>Pre</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.text22}>Blood pressure</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[Bloodpressure === "Yes" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setBloodpressure('Yes') }}>
                            <Text style={[Bloodpressure === "Yes" ? styles.btntext : styles.btntexttwo]}>Yes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[Bloodpressure === "No" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setBloodpressure('No') }}>
                            <Text style={[Bloodpressure === "No" ? styles.btntext : styles.btntexttwo]}>No</Text>
                        </TouchableOpacity>

                    </View>

                    <Text style={styles.text22}>Plan</Text>

                    <View style={styles.flexboxtwo}>

                        <TouchableOpacity style={[Plan === "Online" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPlan('Online') }}>
                            <Text style={[Plan === "Online" ? styles.btntext : styles.btntexttwo]}>Online</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[Plan === "In-Clinic" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPlan('In-Clinic') }}>
                            <Text style={[Plan === "In-Clinic" ? styles.btntext : styles.btntexttwo]}>In-Clinic</Text>
                        </TouchableOpacity>
                    </View>
                    <Text></Text>
                    {Plan === "Online" && <View>
                        <TouchableOpacity onPress={() => setSelectedplan('Messaging')} style={[selectedplan === "Messaging" ? styles.clickflexbtn : styles.flexbtn]}>
                            <AntDesign name='message1' size={30} color='#06aeeb' />
                            <View style={{ marginLeft: 10, width: '88%' }}>
                                <View style={styles.flexbox}>
                                    <Text style={styles.daytext}>Messaging</Text>
                                    <Text style={styles.daytext}>$20</Text>
                                </View>
                                <View style={styles.flexbox}>
                                    <Text style={{ color: '6A6A6A' }}>chats with doctors</Text>
                                    <Text style={{ color: '6A6A6A' }}>30 min</Text>
                                </View>

                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setSelectedplan('Video call')} style={[selectedplan === "Video call" ? styles.clickflexbtn : styles.flexbtn]}>
                            <Feather name='video' size={30} color='#06aeeb' />
                            <View style={{ marginLeft: 10, width: '88%' }}>
                                <View style={styles.flexbox}>
                                    <Text style={styles.daytext}>Video call</Text>
                                    <Text style={styles.daytext}>$60</Text>
                                </View>
                                <View style={styles.flexbox}>
                                    <Text style={{ color: '6A6A6A' }}>Video chat with doctors</Text>
                                    <Text style={{ color: '6A6A6A' }}>30 min</Text>
                                </View>

                            </View>

                        </TouchableOpacity>
                    </View>
                    }

                    <Text style={styles.text2}>Schedules</Text>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={next20Days}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[Schedulesdate === item ? styles.datebox_color : styles.datebox]}
                                onPress={() => {
                                    // Extract the selected date from the formatted string
                                    const [day, dayName] = item.split('-');
                                    const today = new Date();
                                    const selectedDate = new Date(today.getFullYear(), today.getMonth(), day);
                                    setBookdatenew(selectedDate);
                                    setShowTimePicker(true);
                                    setSchedulesdate(item)
                                }}
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
                                {intervallArray.map((interval, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[availabletime === interval.label ? styles.clicktimebox : styles.timebox]}
                                        onPress={() => { setBookTimenew(interval.value); setAvailabletime(interval.label) }}
                                    >
                                        <Text style={[availabletime === interval.label ? styles.timetext_color : styles.daytext]}>{interval.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                        </>
                    )}

                    <Text style={[styles.text22, { marginTop: 16 }]}>Payment</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[PayStatus === "Paid" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Paid') }}>
                            <Text style={[PayStatus === "Paid" ? styles.btntext : styles.btntexttwo]}>Paid</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[PayStatus === "Pending" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Pending') }}>
                            <Text style={[PayStatus === "Pending" ? styles.btntext : styles.btntexttwo]}>In-Clinic</Text>
                        </TouchableOpacity>

                    </View>

                    {PayStatus === "Paid" && <><Text style={[styles.text22, { marginTop: 0 }]}>Transaction type</Text>

                        <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                            <TouchableOpacity style={[PayType === "Case" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayType('Case') }}>
                                <Text style={[PayType === "Case" ? styles.btntext : styles.btntexttwo]}>Case</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[PayType === "Online" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayType('Online') }}>
                                <Text style={[PayType === "Online" ? styles.btntext : styles.btntexttwo]}>Online</Text>
                            </TouchableOpacity>

                        </View>
                        <Text style={styles.text22}>Amount</Text>
                        <TextInput placeholder='Enter amount here..' placeholderTextColor={'#b0b0b0'} style={styles.input} keyboardType='numeric'
                            value={PayAmounOld} onChangeText={(text) => setPayAmounOld(text)}
                        />
                    </>}

                    <LinearGradient
                        colors={['#06aeeb', '#4ccdfc']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 250, marginVertical: 12 }}
                    >
                        <TouchableOpacity
                            style={styles.clickbtn}
                            onPress={bookAppointmentFunction}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.clickbtntext}>Book Appointment</Text>
                            )}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#06aeeb'
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
    imNg: {
        width: '100%', aspectRatio: 1.3, resizeMode: 'contain', height: 'auto',

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
        fontFamily: 'Poppins-Medium',
        fontSize: 14
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
        color: '#06aeeb',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
    btntwo: {
        borderWidth: 1,
        alignItems: 'center',
        width: '25%',
        marginRight: 12,
        paddingVertical: 12,
        marginTop: 8,
        //    marginBottom:16,
        borderRadius: 16,
        borderColor: '#d7d7d7',
    },
    clickbtntwo: {
        alignItems: 'center',
        width: '25%',
        marginRight: 12,
        paddingVertical: 12,
        marginTop: 8,
        //    marginBottom:16,
        borderRadius: 16,
        backgroundColor: '#ff914d'
    },
    flexdate: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btn: {
        paddingVertical: 16,
        marginBottom: 16,
        marginTop: 32,
        backgroundColor: '#06aeeb',
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
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 10
    },
    timebox: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#d7d7d7',
        marginRight: 10
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


        // paddingHorizontal: 16,
    },
    installmentheadtxtbox: {

        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,

    },
    installmentnamee: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-Medium'
    },
    installmentheadicon: {
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 8,
        borderRadius: 8,
    },
    rediusborder: {
        backgroundColor: '#06aeeb',
        marginTop: -200
    },
    clickbtn: {
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        borderRadius: 250,
        elevation: 8,
        shadowColor: '#06aeeb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
})

export default AddAppointment

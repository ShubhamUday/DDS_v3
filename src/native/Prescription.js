/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Button } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto'
import axios from 'axios';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { REACT_APP_HOS } from '@env';

console.log(REACT_APP_HOS)

const Prescription = ({ navigation, route }) => {
    const [Appointmentdata, setAppointmentdata] = useState({})
    const [focusedInput, setFocusedInput] = useState(null);
    const [loadingn, setloadingn] = useState(false);
    const [adviceNew, setadviceNew] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [NoteOld, setNoteOld] = useState('');
    const { param1 } = route.params;

    console.log("gggggggggggggggggggggg", param1)

    // Initialize with two pairs of input fields and toggle states
    const [inputs, setInputs] = useState([{ medicinename: '', morningdos: 'Morning', afternoon: '', evening: '', night: 'Night', foodtime: 'After', medicinetype: 'Tablet', quantity: '', count: 1, days: '7' }]);

    // Function to handle adding a new pair of input fields
    const addFields = () => {
        setInputs([...inputs, { medicinename: '', morningdos: 'Morning', afternoon: '', evening: '', night: 'Night', foodtime: 'After', medicinetype: 'Tablet', quantity: '', count: 1, days: '7' }]);
    };

    // Function to handle input changes
    const handleInputChange = (index, field, value) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value; // Update the specific field
        setInputs(newInputs);
    };

    // Function to handle toggle change for the first set of toggle buttons
    const handlemorningdosChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].morningdos = value; // Update the morningdos value
        setInputs(newInputs);
    };

    const handleafternoonChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].afternoon = value;
        setInputs(newInputs);
    };

    const handleeveningChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].evening = value;
        setInputs(newInputs);
    };

    const handlenightChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].night = value;
        setInputs(newInputs);
    };

    // Function to handle toggle change for the second set of toggle buttons
    const handlefoodtimeChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].foodtime = value; // Update the foodtime value
        setInputs(newInputs);
    };

    const handlemedicinetypeChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].medicinetype = value; // Update the medicinetype value
        setInputs(newInputs);
    };

    // Function to handle increment
    const handleIncrement = (index) => {
        const newInputs = [...inputs];
        newInputs[index].count += 1; // Increment the count
        setInputs(newInputs);
    };

    // Function to handle decrement
    const handleDecrement = (index) => {
        const newInputs = [...inputs];
        if (newInputs[index].count > 1) {
            newInputs[index].count -= 1; // Decrement the count
        }
        setInputs(newInputs);
    };

    // Function to handle deleting a specific set of input fields
    const handleDelete = (index) => {
        const newInputs = inputs.filter((_, i) => i !== index); // Remove the item at the specified index
        setInputs(newInputs);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        setIsLoading(true)
        const values = { appointmentID: param1, advice: adviceNew, note: NoteOld, valuable: inputs }
        console.log('Submitted data:', values);

        try {
            const result = await axios.post(`https://dentalbackend-3gjq.onrender.com/add-prescription`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (result.data) {
                console.log("DONEEE");
                navigation.goBack()
            }
        } catch (error) {
            console.error('Error uploading document', error);
            setIsLoading(false)
        }
    };

    const getAllApointments = async () => {

        try {
            const result = await axios.get(`https://dentalbackend-3gjq.onrender.com/get-single-appointment-with-details/${param1}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAppointmentdata(result.data)
            setloadingn(false)
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleFocus = (inputName) => {
        setFocusedInput(inputName);
    };

    const handleBlur = () => {
        setFocusedInput(null);
    };

    const uploadImages = async () => {
        setIsLoading(true)

    };

    useEffect(() => {
        getAllApointments()
    }, []);

    return (<>
        {loadingn ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#06aeeb" /></View> :
            <>
                <View style={styles.installmentheadbox}>
                    <View style={styles.installmentheadtxtbox}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.installmentheadicon}><AntDesign name="arrowleft" size={23} color="white" /></TouchableOpacity>
                        <Text style={styles.installmentnamee}>Prescription</Text></View>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 16 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[styles.date_main_text, { marginTop: 12, marginBottom: 4 }]}>{Appointmentdata.Bookdate ? moment(Appointmentdata.Bookdate).format('MMM DD, YYYY') : ''} - {Appointmentdata.BookTime}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.flex_for_icon_div}>
                        <View style={styles.flex_for_image_div}>

                            <View>
                                <View style={styles.icon_text_div}>
                                    <Text style={styles.light_main_text}>Name : {Appointmentdata.patientName ? <Text style={styles.gender_text}> {Appointmentdata.patientName}</Text> : <Text style={styles.gender_text}> {Appointmentdata.userID?.name}</Text>}</Text>
                                </View>
                                <View style={styles.icon_text_div}>
                                    <Text style={styles.light_main_text}>Appointment type : <Text style={styles.gender_text}> {Appointmentdata.Plan}</Text></Text>
                                </View>
                                <View style={styles.icon_text_div}>
                                    <Text style={styles.light_main_text}>Booking ID :<Text style={styles.id_text}>#D{Appointmentdata._id?.slice(0, 6)}</Text></Text>
                                </View>
                                <View style={styles.icon_text_div}>
                                    <Text style={styles.light_main_text}>Gender :<Text style={styles.gender_text}> {Appointmentdata.gender}</Text>   Age : <Text style={styles.gender_text}> {Appointmentdata.age}</Text></Text>
                                </View>
                                {Appointmentdata.diabetes &&
                                    <View style={styles.icon_text_div}>
                                        <Text style={styles.light_main_text}>Diabetes :<Text style={styles.gender_text}> {Appointmentdata.diabetes}</Text></Text>
                                    </View>}

                                {Appointmentdata.Bloodpressure &&
                                    <View style={styles.icon_text_div}>
                                        <Text style={styles.light_main_text}>Blood Pressure : <Text style={styles.gender_text}> {Appointmentdata.Bloodpressure}</Text></Text>
                                    </View>}


                                {Appointmentdata.Weight &&
                                    <View style={styles.icon_text_div}>
                                        <Text style={styles.light_main_text}>Weight : <Text style={styles.gender_text}> {Appointmentdata.Weight}</Text></Text>
                                    </View>}

                                <Text style={styles.light_main_text}>Payment : <Text style={styles.gender_text}> {Appointmentdata.PayType}</Text></Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.marginBox}>
                        <Text style={styles.text4}>Treatment : <Text style={styles.details_text}>{Appointmentdata.Treatmentfor}</Text></Text>
                        {Appointmentdata.checkInStatus === "Checked-In" ? <View style={{ flexDirection: 'row', alignItems: 'center' }} ><Text style={[styles.date_main_text, { marginRight: 10 }]} >Checked-In</Text><Fontisto name="checkbox-active" size={20} color={'#03ccbb'} /></View> : ''}

                    </View>

                    <Text style={{ paddingHorizontal: 16 }} >Details :<Text style={styles.details_text}> {Appointmentdata.ProblemDetails}</Text></Text>

                    <View style={styles.divider} />

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >

                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', paddingLeft: 16 }}>
                                <Text style={styles.text2}> Medicine Name </Text>
                                <Text style={styles.text2}> Dosage Time </Text>
                                <Text style={styles.text2}> Food </Text>
                                <Text style={styles.text2}> Medicine Type </Text>
                                <Text style={styles.text2}> Quantity </Text>
                                <Text style={styles.text2}> Duration</Text>
                            </View>

                            <View style={styles.divider} />

                            {inputs.map((input, index) => (<>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                    <TextInput placeholder='Enter medicine name here..' placeholderTextColor={'#b0b0b0'}
                                        style={[styles.inpuCut, focusedInput === index && styles.inputFocused]}
                                        onFocus={() => handleFocus(index)}
                                        onBlur={handleBlur}
                                        value={input.medicinename}
                                        onChangeText={(text) => handleInputChange(index, 'medicinename', text)}

                                    />
                                    <TouchableOpacity
                                        style={[input.morningdos === 'Morning' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlemorningdosChange(index, input.morningdos === 'Morning' ? '' : 'Morning')}
                                    >
                                        <Text style={[input.morningdos === 'Morning' ? styles.btntext : styles.btntexttwo]}>Morning</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.afternoon === 'Afternoon' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handleafternoonChange(index, input.afternoon === 'Afternoon' ? '' : 'Afternoon')}
                                    >
                                        <Text style={[input.afternoon === 'Afternoon' ? styles.btntext : styles.btntexttwo]}>Afternoon</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.evening === 'Evening' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handleeveningChange(index, input.evening === 'Evening' ? '' : 'Evening')}
                                    >
                                        <Text style={[input.evening === 'Evening' ? styles.btntext : styles.btntexttwo]}>Evening</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.night === 'Night' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlenightChange(index, input.night === 'Night' ? '' : 'Night')}
                                    >
                                        <Text style={[input.night === 'Night' ? styles.btntext : styles.btntexttwo]}>Night</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.foodtime === 'Before' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlefoodtimeChange(index, 'Before')}
                                    >
                                        <Text style={[input.foodtime === 'Before' ? styles.btntext : styles.btntexttwo]}>Before</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.foodtime === 'After' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlefoodtimeChange(index, 'After')}
                                    >
                                        <Text style={[input.foodtime === 'After' ? styles.btntext : styles.btntexttwo]}>After</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.medicinetype === 'Tablet' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlemedicinetypeChange(index, 'Tablet')}
                                    >
                                        <Text style={[input.medicinetype === 'Tablet' ? styles.btntext : styles.btntexttwo]}>Tablet</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.medicinetype === 'Capsule' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlemedicinetypeChange(index, 'Capsule')}
                                    >
                                        <Text style={[input.medicinetype === 'Capsule' ? styles.btntext : styles.btntexttwo]}>Capsule</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.medicinetype === 'Tonic' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlemedicinetypeChange(index, 'Tonic')}
                                    >
                                        <Text style={[input.medicinetype === 'Tonic' ? styles.btntext : styles.btntexttwo]}>Tonic</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[input.medicinetype === 'Other' ? styles.clickbtntwo : styles.btntwo]}
                                        onPress={() => handlemedicinetypeChange(index, 'Other')}
                                    >
                                        <Text style={[input.medicinetype === 'Other' ? styles.btntext : styles.btntexttwo]}>Other</Text>
                                    </TouchableOpacity>

                                    {input.medicinetype === "Tonic" ? <><TextInput placeholder='Enter ml' placeholderTextColor={'#b0b0b0'}
                                        style={[styles.inpunewCut, focusedInput === index && styles.inputFocused]}
                                        onFocus={() => handleFocus(index)}
                                        onBlur={handleBlur}
                                        keyboardType='numeric'
                                        value={input.quantity}
                                        onChangeText={(text) => handleInputChange(index, 'quantity', text)} />
                                        <Text style={styles.btntexttwo}>ml      </Text>
                                    </> : <>
                                        <TouchableOpacity
                                            style={styles.plusbtns}
                                            onPress={() => handleIncrement(index)}
                                        >
                                            <AntDesign name="minus" size={22} color='#06aeeb' />
                                        </TouchableOpacity>

                                        <Text style={styles.btntecvtwo}>1/{input.count}</Text>

                                        <TouchableOpacity
                                            style={styles.plusbtns}
                                            onPress={() => handleDecrement(index)}
                                        >
                                            <AntDesign name="plus" size={22} color='#06aeeb' />
                                        </TouchableOpacity>

                                    </>}
                                    <TextInput placeholder='Enter days' placeholderTextColor={'#b0b0b0'}
                                        style={[styles.inpunewCut, focusedInput === index && styles.inputFocused]}
                                        onFocus={() => handleFocus(index)}
                                        onBlur={handleBlur}
                                        keyboardType='numeric'
                                        value={input.days}
                                        onChangeText={(text) => handleInputChange(index, 'days', text)} />


                                    <Text style={styles.btntexttwo}>Days  </Text>
                                    <TouchableOpacity onPress={() => handleDelete(index)} >
                                        <AntDesign name="close" size={25} color='#FF5733' />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} /></>))}
                        </View>
                    </ScrollView>

                    <LinearGradient
                        colors={['#06aeeb', '#4ccdfc']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gnewadd}
                    >
                        <TouchableOpacity onPress={addFields} style={{ alignItems: 'center', width: '100%', height: 'auto', paddingVertical: 13, flexDirection: 'row', justifyContent: "center" }}>
                            <AntDesign name="plus" size={20} color='white' />
                            <Text style={styles.daytext_color}> Add medicine</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <Text style={styles.tetype2}>Advice</Text>
                    <TextInput placeholder='Enter advice here...' placeholderTextColor={'#969696'} style={styles.intype2}
                        value={adviceNew}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => { setadviceNew(text) }} />
                    <Text style={styles.tetype2}>Note</Text>
                    <TextInput placeholder='Enter note here...' placeholderTextColor={'#969696'} style={styles.intype2}
                        value={NoteOld}
                        onChangeText={(text) => { setNoteOld(text) }} />
                    <LinearGradient
                        colors={['#06aeeb', '#4ccdfc']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 250, marginHorizontal: 16, marginVertical: 16 }}
                    >
                        <TouchableOpacity
                            style={styles.clickbtn}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.clickbtntext}>Create</Text>
                            )}
                        </TouchableOpacity>
                    </LinearGradient>
                </ScrollView>
            </>}</>
    )
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#ffffff'
    },
    clickbtntwo: {
        borderWidth: 1,
        alignItems: 'center',
        height: 50,
        marginRight: 12,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 16,
        borderColor: '#ff914d',
        backgroundColor: '#ff914d'
    },
    btntexttwo: {
        color: '#25408f',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
    intype2: {
        fontSize: 16,
        color: '#132F4D',
        marginBottom: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        textAlignVertical: 'top'
    },
    btntecvtwo: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        marginRight: 12,
    },
    btntext: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 16
    },
    btntwo: {
        borderWidth: 1,
        alignItems: 'center',
        height: 50,
        marginRight: 12,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#ff914d',
        borderRadius: 16,
        borderColor: '#d7d7d7',
    },
    plusbtns: {
        borderWidth: 1,
        alignItems: 'center',
        height: 50,
        marginRight: 12,
        width: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#ff914d',
        borderRadius: 16,
        borderColor: '#d7d7d7',
    },






    new_client: {
        flexDirection: 'row'
    },
    inputFocused: {
        borderColor: '#ff914d',
        borderWidth: 1,
    },
    inpuCut: {
        width: 300,
        fontSize: 16,
        backgroundColor: '#fff',
        borderColor: '#06aeeb',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        marginRight: 12,
        marginLeft: 16

    },
    inpunewCut: {
        width: 100,
        fontSize: 16,
        backgroundColor: '#fff',
        borderColor: '#06aeeb',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        marginRight: 12,


    },
    footerbtnconta_secondry: {
        width: '100%',
        backgroundColor: '#fff',
        borderTopColor: '#d7d7d7',
        borderTopWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    view_all_reviews: {
        fontSize: 13,
        // fontWeight:'900',
        color: '#06aeeb',
        fontFamily: 'Poppins-Medium',
        borderBottomWidth: 1,
        borderBottomColor: '#06aeeb',

    },
    footerbtnconta_main: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopColor: '#d7d7d7',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    iconbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginBottom: 16,
        marginTop: 10
    },
    logoprofile: {
        width: 115,
        height: 115,
        marginRight: 10,
        borderRadius: 200,
        backgroundColor: '#D7D7D7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    light_main_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Light',
    },

    box: {
        width: '32%',
        marginBottom: 16
    },

    line: {
        height: 12,
        backgroundColor: '#6A6A6A',
        width: 1,
        // marginHorizontal:2
    },

    btn: {
        backgroundColor: '#06aeeb',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 16
    },
    gnewadd: {
        width: '48%',
        alignItems: 'center',



        borderRadius: 250,

        elevation: 8,
        shadowColor: '#06aeeb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        marginVertical: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: "center"
    },
    daytext_color: {
        color: 'white',
        fontSize: 16,
        // fontWeight:'500',
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
    clickbtntext: {
        color: '#fff',
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    footerbtncontainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopColor: '#d7d7d7',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    marginBox: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    boxx: {
        width: '10%',
        alignItems: 'flex-end',
        paddingTop: 5
    },
    textt3: {
        color: '#2C2C2C',
        fontWeight: '600'
    },

    text4: {
        color: '#6A6A6A',
        fontFamily: 'Poppins-Light',
    },

    divider: {
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
        marginVertical: 14
    },

    text2: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',

    },

    tetype2: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        marginLeft: 16
    },
    installmentheadbox: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingVertical: 13,
        backgroundColor: '#06aeeb',

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
        marginHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 8,
        borderRadius: 8,
        marginVertical: 8
    },

    rediusborder: {
        backgroundColor: '#06aeeb',
        height: 50,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    flex_for_image_div: {
        flexDirection: 'row',

    },
    flex_for_icon_div: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 16
    },
    dr_name_text: {
        color: '#0563C1',
        fontFamily: 'Poppins-Medium',
        fontSize: 15
    },
    client_name_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Medium',
        fontSize: 15
    },
    icon_text_div: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5
    },
    gender_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Medium',
    },
    address_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Medium',
    },
    reson_text: {
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },
    id_text: {
        color: '#0563C1',
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    appointmenent_main_text: {
        color: '#2C2C2C',
        fontFamily: 'Poppins-Regular',
    },
    details_text: {
        color: '#2C2C2C',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
    },
    // divider: {
    //     borderTopColor: '#E6E6E6',
    //     borderTopWidth: 1,
    //     marginVertical: 14
    // },

    date_main_text: {
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        fontSize: 17
    },

    boxx2: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    remind_text: {
        color: '#2C2C2C'
    },
    main: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16,
        // paddingTop: 16,
        backgroundColor: '#f5f5f5'
    },
    contain: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '33.33%',
        paddingVertical: 16
    },


})
export default Prescription

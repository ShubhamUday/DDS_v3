import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ToastAndroid, ActivityIndicator, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { REACT_APP_HOS } from '@env';
import { createReminder } from '../api';
import LinearGradient from 'react-native-linear-gradient';
console.log(REACT_APP_HOS)





const AddPatientDetails = ({ appointID, functionToReload, Appointmentdata }) => {
    const [gender, setGender] = useState(Appointmentdata.gender);
    const [age, setage] = useState(Appointmentdata.age);
    const [Treatmentfor, setTreatmentfor] = useState(Appointmentdata.Treatmentfor);
    const [ProblemDetails, setProblemDetails] = useState(Appointmentdata.ProblemDetails);
    const [diabetes, setdiabetes] = useState(Appointmentdata.diabetes || 'No');
    const [Weight, setWeight] = useState(Appointmentdata.Weight);
    const [Bloodpressure, setBloodpressure] = useState(Appointmentdata.Bloodpressure || 'No');
    const [isLoading, setIsLoading] = useState(false);



    const acceptController = async () => {
        setIsLoading(true)

        const values = { gender, age: Number(age), Treatmentfor, ProblemDetails, diabetes, Weight: Number(Weight), Bloodpressure }
        console.log(values)
        try {
            const result = await axios.put(`http://10.0.2.2:5000/update-Appointment-Details/${appointID}`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(result.data)
            if (result.data) {
                functionToReload()
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    };







    return (
        <><ScrollView>

            <View style={{ marginHorizontal: 16, marginBottom: 16 }} >
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
                    value={age.toString()}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text)) {
                            setage(text)
                        }
                    }}
                />


                <Text style={styles.text22}>Weight</Text>
                <TextInput placeholder='Enter weight here..' placeholderTextColor={'#b0b0b0'} style={styles.input} keyboardType='numeric'

                    value={Weight?.toString()}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text)) {
                            setWeight(text)
                        }
                    }}
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
                <TextInput placeholder='Describe about your disease or problem' placeholderTextColor={'#b0b0b0'} multiline={true} numberOfLines={4} style={styles.input2}
                    value={ProblemDetails} onChangeText={(text) => setProblemDetails(text)}
                />











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



                <LinearGradient
                    colors={['#06aeeb', '#4ccdfc']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 250, marginTop: 16 }}
                >
                    <TouchableOpacity style={styles.clickbtn} onPress={acceptController} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.clickbtntext}>Save</Text>
                        )}
                    </TouchableOpacity>
                </LinearGradient>







            </View>
        </ScrollView></>
    )
}

const styles = StyleSheet.create({
    flexboxtwo: {
        flexDirection: 'row',
        // justifyContent:'space-between',
        flexWrap: 'wrap'
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
    btn: {
        backgroundColor: '#06aeeb',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 16,
        marginVertical: 16,

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
    text22: {
        marginTop: 10,
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
    },
    input: {
        // paddingHorizontal: 4,
        fontSize: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        paddingHorizontal: 12,
        fontFamily: 'Poppins-Regular',
        marginBottom: 16,
        marginTop: 8
    },
    input2: {
        fontSize: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        paddingHorizontal: 12,
        fontFamily: 'Poppins-Regular',
        marginBottom: 16,
        // marginTop: 8,
        textAlignVertical: 'top'
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
    btntext: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 16
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
    btntexttwo: {
        color: '#06aeeb',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
    text2: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        marginBottom: 10
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









})

export default AddPatientDetails

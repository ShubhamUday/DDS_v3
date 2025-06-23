import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ToastAndroid, ActivityIndicator, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { REACT_APP_HOS } from '@env';
import LinearGradient from 'react-native-linear-gradient';

console.log(REACT_APP_HOS)





const PaymentUpdate = ({ appointID, functionTosecondMod, AppointmentdatNew }) => {
    const [gender, setGender] = useState('Male');
    const [age, setage] = useState(0);
    const [Treatmentfor, setTreatmentfor] = useState('');
    const [ProblemDetails, setProblemDetails] = useState('');
    const [diabetes, setdiabetes] = useState('No');
    const [Weight, setWeight] = useState(0);
    const [Bloodpressure, setBloodpressure] = useState('No');
    const [isLoading, setIsLoading] = useState(false);
    const [PayAmounOld, setPayAmounOld] = useState('500');
    const [PayStatus, setPayStatus] = useState('Pending');
    const [PayType, setPayType] = useState('Case');


    const acceptController = async () => {
        setIsLoading(true)
        const PayAmount = parseFloat(PayAmounOld);
        const values = { PayAmount, PayStatus, PayType }
        console.log(values)
        try {
            const result = await axios.put(`http://10.0.2.2:5000/update-Appointment-Details/${appointID}`, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(result.data)
            if (result.data) {
                functionTosecondMod()
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    };




    useEffect(() => {
        setPayAmounOld(AppointmentdatNew.PayAmount)
        setPayStatus(AppointmentdatNew.PayStatus)
        setPayType(AppointmentdatNew.PayType)
    }, []);


    return (
        <><ScrollView>
            <View style={{ marginHorizontal: 16, marginBottom: 16 }} >

                {AppointmentdatNew.PayStatus === "Paid" ? <><View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}><Text style={[styles.text22]}>Payment status : </Text><Text style={styles.small_tex_nkb}> {AppointmentdatNew.PayStatus}</Text></View>
                    <Text style={[styles.text22, { marginTop: 16 }]}>Payment amount : {AppointmentdatNew.PayAmount}₹</Text>
                    <Text style={[styles.text22, { marginTop: 16 }]}>Transaction type : {AppointmentdatNew.PayType}</Text>
                </> : <>

                    <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}><Text style={[styles.text22]}>Payment status : </Text><Text style={styles.small_tex_vb}> {AppointmentdatNew.PayStatus}</Text></View>
                    <Text style={[styles.text22, { marginTop: 16 }]}>Payment amount : {AppointmentdatNew.PayAmount}₹</Text>

                    <View style={styles.bottomline} />

                    <Text style={[styles.text22, { marginTop: 26, textAlign: 'center' }]}>Update payment detials</Text>
                    <Text style={[styles.text22, { marginTop: 16 }]}>Status</Text>

                    <View style={[styles.flexboxtwo, { marginBottom: 16 }]}>

                        <TouchableOpacity style={[PayStatus === "Paid" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Paid') }}>
                            <Text style={[PayStatus === "Paid" ? styles.btntext : styles.btntexttwo]}>Paid</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[PayStatus === "Pending" ? styles.clickbtntwo : styles.btntwo]} onPress={() => { setPayStatus('Pending') }}>
                            <Text style={[PayStatus === "Pending" ? styles.btntext : styles.btntexttwo]}>Pending</Text>
                        </TouchableOpacity>

                    </View>

                    <Text style={[styles.text22, { marginTop: 0 }]}>Transaction type</Text>

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
                        value={PayAmounOld} onChangeText={(text) => setPayAmounOld(text)} />


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
                                <Text style={styles.clickbtntext}>Update</Text>
                            )}
                        </TouchableOpacity>
                    </LinearGradient>
                </>}
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
    bottomline: {
        borderTopWidth: 1,
        marginTop: 14,
        borderTopColor: '#e6e6e6'
    },
    small_tex_vb: {
        color: '#132F4D',
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#f66',
        padding: 3,
        backgroundColor: '#f66',
        color: 'white',
        borderRadius: 5,
        paddingBottom: -3,
        fontFamily: 'Poppins-Medium'
    },
    small_tex_nkb: {
        color: '#132F4D',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#00C013',
        padding: 3,
        backgroundColor: '#00C013',
        color: 'white',
        borderRadius: 5,
        paddingBottom: -3,
        fontFamily: 'Poppins-Medium'
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
        fontFamily: 'Poppins-Medium',
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

export default PaymentUpdate

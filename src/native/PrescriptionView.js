/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert, FlatList, Modal, ToastAndroid } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { REACT_APP_HOS } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';


const PrescriptionView = ({ navigation, route }) => {
    const [Appointmentdata, setAppointmentdata] = useState({})
    const [medicinID, setmedicinID] = useState([])
    const [modalopeold, setModalopeold] = useState(false);
    const [tempObject, settempObject] = useState({})


    const { param1 } = route.params;


    const getAllApointments = async () => {

        try {
            const result = await axios.get(`https://dentalbackend-3gjq.onrender.com/get-single-appointment-with-details/${param1}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAppointmentdata(result.data)
            setmedicinID(result.data.prescriptionID)
        }
        catch (error) {
            console.log(error)
        }
    }

    const modalOpenAndSaveObject = (ev) => {
        setModalopeold(true)
        settempObject(ev)
    }



    const deleteelementthis = async () => {
        setModalopeold(false)
        const mainID = tempObject._id
        try {
            const result = await axios.delete(`https://dentalbackend-3gjq.onrender.com/delete-prescription/${mainID}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data) {
                getAllApointments()
                ToastAndroid.showWithGravityAndOffset(
                    'Medicine deleted successfully!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getAllApointments()
    }, []);

    return (
        <>

            <ScrollView style={styles.container}>


                <View style={styles.installmentheadbox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <View style={styles.startcontent}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.installmentheadicon}><AntDesign name="arrowleft" size={23} color="white" /></TouchableOpacity>
                            <Text style={styles.installmentnamee}>Prescription</Text>
                        </View>

                        <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.previewBordr}><Text style={styles.previewTxt}>Preview</Text></TouchableOpacity></View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {Appointmentdata.patientName ? <Text style={styles.patientTxt}>{Appointmentdata.patientName}</Text> : <Text style={styles.patientTxt}>{Appointmentdata.userID?.name}</Text>}<Text style={styles.agAndTxt}> | {Appointmentdata.gender === "Male" ? "M" : "F"} {Appointmentdata.age}</Text></View>
                        <Text style={styles.previewTxt}>{Appointmentdata.Bookdate ? moment(Appointmentdata.Bookdate).format('DD MMM `YY') : ''}</Text>


                    </View>
                </View>



                <View style={styles.rediusborder}></View>
                <View style={styles.containertwo}>
                    <Text style={styles.rxTt}>Rx</Text>

                    {medicinID?.map((e, id) => (<>
                        <View style={{ flexDirection: 'row', paddingLeft: 12, alignItems: 'center', borderTopRightRadius: 12, borderTopLeftRadius: 12, marginTop: 15, backgroundColor: '#deecfc', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Fontisto name="injection-syringe" size={20} color="#06aeeb" style={{ marginRight: 10 }} />
                                <Text style={styles.medicinTxt}>{e.medicinename} · <Text style={styles.medicinTableTxt}>{e.medicinetype}</Text></Text></View>
                            <TouchableOpacity onPress={() => modalOpenAndSaveObject(e)} style={{ paddingVertical: 13, paddingHorizontal: 12 }}>
                                <AntDesign name="close" size={20} color="#06aeeb" /></TouchableOpacity>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#deecfc', borderWidth: 1, borderBottomWidth: 0, paddingHorizontal: 10, padding: 12, flexWrap: 'wrap', }}>
                            {e.medicinetype === "Tablet" || e.medicinetype === "Capsule" ? <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>1{e.count !== 1 && "/"}{e.count === 1 ? '' : e.count} {e.medicinetype}</Text></View> : <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.quantity} ml</Text></View>}

                            <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.days} days</Text></View>
                            <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.foodtime} meal</Text></View>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#deecfc', borderBottomEndRadius: 12, borderWidth: 1, paddingHorizontal: 10, borderBottomStartRadius: 12, padding: 12, flexWrap: 'wrap', }}>
                            {e.morningdos !== "" && <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.morningdos}</Text></View>}
                            {e.afternoon !== "" && <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.afternoon}</Text></View>}
                            {e.evening !== "" && <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.evening}</Text></View>}
                            {e.night !== "" && <View style={styles.smallBox}><Text style={styles.medicinTableTxt}>{e.night}</Text></View>}

                        </View></>))}





                    <View style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12, borderColor: '#deecfc', borderWidth: 1, paddingHorizontal: 10, padding: 12, marginTop: 15, borderBottomWidth: 0, }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', }} >
                            <View style={{ backgroundColor: '#deecfc', marginRight: 10, padding: 5, borderRadius: 6 }} >
                                <Feather name="edit" size={20} color="#06aeeb" style={{}} /></View>
                            <Text style={styles.medicinTxt}>Notes</Text></View>
                        <Text style={styles.notesNTxt}>{Appointmentdata.note}</Text>


                    </View>
                    <View style={{ flexDirection: 'column',  borderColor: '#deecfc', borderBottomEndRadius: 12, borderWidth: 1, paddingHorizontal: 10, borderBottomStartRadius: 12, padding: 12,  }}>

                        <Text style={styles.advicbTxt}>Advice</Text>
                        <Text style={styles.AdviseTxt}>{Appointmentdata.advice}</Text>
                    </View>





                    <Text style={styles.AdviseTxt}></Text>





                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalopeold}
            >
                <View style={styles.modalcontainer2} >
                    <View style={styles.modalContent}>
                        <View style={styles.alginrightnew}>
                            <TouchableOpacity style={styles.crossbtnstyleing} onPress={() => setModalopeold(false)}><AntDesign name="close" size={28} color="black" /></TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>

                            <Text style={styles.modaltxt11}>Are you sure you want to delete "{tempObject.medicinename} · {tempObject.medicinetype}"?</Text>



                        </View>

                        <View style={styles.flexbox}>

                            <TouchableOpacity style={styles.btn}  onPress={deleteelementthis}>
    <Text style={styles.btnbetext}>Yes</Text>
</TouchableOpacity>
                            <LinearGradient
    colors={['#06aeeb', '#4ccdfc']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.clickbtn}
>
    <TouchableOpacity style={{ alignItems: 'center' , width:'100%', height:'auto', paddingVertical:12 }} onPress={() => setModalopeold(false)}>
        <Text style={styles.clickbtntext}>No</Text>
    </TouchableOpacity>
</LinearGradient>
                        </View>



                    </View></View>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        // padding:16,
        backgroundColor: '#fff'
    },
    
    clickbtn: {
        width: '48%',
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
    modalcontainer2: {
        // flex: 0.5,
        // justifyContent: 'flex-end',
        // padding: 16,
        // backgroundColor: 'white',
        // marginHorizontal:16,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        width: '100%'
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        borderRadius: 10,
        // alignItems: 'center',
        // elevation:5,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        paddingBottom: 16,
        borderColor: '#D7D7D7',
    },
    containertwo: {
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 30,
        marginTop: -25
    },
    modaltxt11: {
        fontSize: 17,
        fontFamily: 'Poppins-Medium',
        color: '#132F4D',
        // padding: 10,
        marginTop: 6,
        marginBottom: 15,
        textAlign: 'center'
    },
    modaldevider: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    alginrightnew: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 40,
        paddingBottom: 10
    },
    crossbtnstyleing: {
        borderWidth: 1,
        borderColor: '#d7d7d7',
        marginTop: -22,
        backgroundColor: 'white',
        height: 55,
        width: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },




    rediusborder: {
        backgroundColor: '#06aeeb',
        height: 30,
        // borderBottomLeftRadius: 25,
        // borderBottomRightRadius: 25
    },
    flexbox: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        // paddingVertical: 12,
        width: '48%',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#06aeeb',
        backgroundColor: 'white',
        borderRadius: 50,
        justifyContent:'center'
        // elevation: 8,
        // shadowColor: '#06aeeb',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.15,
        // shadowRadius: 6,
    },
    btnbetext: {
        color: '#06aeeb',
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    btn2: {
        paddingVertical: 12,
        width: '48%',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#06aeeb'
    },
    btntext: {
        color: '#757575',
        fontFamily: "Poppins-Medium",
        fontSize: 16
    },
    notex: {
        color: 'white',
        fontFamily: "Poppins-Medium",
        fontSize: 16
    },


    scrollView: {
        marginBottom: 16
    },
    installmentheadicon: {
        marginHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 8,
        borderRadius: 8,
    },

    startcontent: {
        alignItems: 'center',
        flexDirection: 'row',
justifyContent:'center',

        backgroundColor: '#06aeeb',
        // paddingHorizontal: 16,
    },




    installmentheadbox: {
        alignItems: 'center',
        paddingVertical: 10,

        backgroundColor: '#06aeeb',
        // paddingHorizontal: 16,
    },

    installmentnamee: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Poppins-Regular',
    },
    rxTt: {
        color: 'black',
        fontSize: 25,
        fontFamily: 'Poppins-SemiBold',
        marginTop: -15,
    },
    previewTxt: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    patientTxt: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    medicinTxt: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    advicbTxt: {
        color: '#06aeeb',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    medicinTableTxt: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    notesNTxt: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',

        marginTop: 10
    },
    AdviseTxt: {
        color: 'black',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: 6
    },
    agAndTxt: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
    },
    previewBordr: {
        paddingHorizontal: 12,
        paddingTop: 2,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 50,
        marginRight: 16,
        backgroundColor: '#06aeeb',
    },
    smallBox: {
        paddingHorizontal: 12,
        paddingTop: 7,
        marginTop: 12,
        borderRadius: 12,
        marginRight: 16,
        backgroundColor: '#e6effa',
        paddingBottom: 5,
    },










})
export default PrescriptionView

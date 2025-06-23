import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ToastAndroid, Alert, Image, FlatList, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StepIndicator from '../Components/StepIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import axios from 'axios';

const ManageJob = ({ navigation }) => {

    const [currentStep, setcurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [progileimageurl, setprogileimageurl] = useState();
    const [drname, setdrname] = useState('');
    const [designation, setdesignation] = useState('');
    const [biography, setbiography] = useState('');
    const [yearsofexperience, setyearsofexperience] = useState('');
    const [patientchecked, setpatientchecked] = useState('');
    const [instituteName, setinstituteName] = useState('');
    const [registrationNumber, setregistrationNumber] = useState('');
    const [aadharNumber, setaadharNumber] = useState('');
    const [MainData, setMainData] = useState('');
    const [documentArray, setdocumentArray] = useState([]);
    const [datas, setDatas] = useState();
    const [isChecked, setIsChecked] = useState(false);


    const SelectDoc = async () => {
        try {
            const doc = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true,
            });

            if (doc.length > 2) {
                Alert.alert(
                    'You cannot select more than 2 images.',
                    'Limit is Max 2 images.',
                    [
                        { text: 'Okay.' },
                    ],
                    { cancelable: false }
                );
            } else { (setDatas(doc)) }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the upload", err)
            } else {
                console.log(err);
            }
        }
    }

    const deleteselectedimage = () => {
        setDatas();
    };

    const handleNextStep = () => {
        const showToast = (message) => {
            ToastAndroid.showWithGravityAndOffset(
                message,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        };

        if (currentStep === 1) {
            // Validate Step 1 fields
            if (!drname.trim()) return showToast("Name is required.");
            if (!designation.trim()) return showToast("Designation is required.");
            if (!yearsofexperience || isNaN(yearsofexperience)) return showToast("Years of experience must be a number.");
            if (!patientchecked || isNaN(patientchecked)) return showToast("Patient checked must be a number.");
            if (!instituteName.trim()) return showToast("Institute name is required.");
            if (!registrationNumber.trim()) return showToast("Registration number is required.");
            if (!aadharNumber || !/^\d{12}$/.test(aadharNumber)) return showToast("Aadhar number must be a 12-digit number.");
            if (!biography.trim()) return showToast("Biography is required.");
        }

        if (currentStep === 2) {
            // Validate image upload step
            if (!datas || datas.length === 0 || datas.length > 2) {
                return showToast("Please upload the image of the Aadhaar card and the institute certificate/Degree");
            }
        }

        setcurrentStep(currentStep + 1);
    };


    const uploadImages = async () => {

        if (!isChecked) {
            ToastAndroid.showWithGravityAndOffset(
                'Please agree to the Terms & Conditions and Privacy Policy before submitting.',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            return;
        }
        setIsLoading(true);
        const doctorId = await AsyncStorage.getItem('doctorID');

        const yearsofexperiencTemp = Number(yearsofexperience);
        const patientcheckeTemp = Number(patientchecked);
        const aadharNumbeTemp = Number(aadharNumber);
        const FormSubmitted = 'Yes';

        try {
            const formData = new FormData();
            formData.append('doctorId', doctorId);
            formData.append('drname', drname);
            formData.append('designation', designation);
            formData.append('biography', biography);
            formData.append('yearsofexperience', yearsofexperiencTemp);
            formData.append('patientchecked', patientcheckeTemp);
            formData.append('instituteName', instituteName);
            formData.append('registrationNumber', registrationNumber);
            formData.append('aadharNumber', aadharNumbeTemp);
            formData.append('FormSubmitted', FormSubmitted);

            if (datas && datas.length > 0) {
                const allValid = datas.every(img => img.uri && img.type);
                if (!allValid) {
                    showToast("Some images are not ready yet. Please try again in a moment.");
                    return;
                }
            }

            if (datas && datas.length > 0) {
                datas.forEach((image, index) => {
                    const fileName = `image_${index + 1}.jpg`;
                    formData.append('images', {
                        uri: image.uri,
                        name: fileName,
                        type: image.type,
                    });
                });
            }

            const apiUrl = `http://10.0.2.2:5000/add-job-to-doctor-profile`;
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                ToastAndroid.showWithGravityAndOffset(
                    'Form submitted successfully',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error updating clinic:', error);
            ToastAndroid.showWithGravityAndOffset(
                'Failed to submitted details. Please try again in a moment.',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } finally {
            setIsLoading(false);
        }
    };


    const getsingleUDetaisl = async () => {
        const doctorID = await AsyncStorage.getItem('doctorID');
        try {
            const result = await axios.get(`http://10.0.2.2:5000/get-single-doctor/${doctorID}`, {
                headers: { 'Content-Type': 'application/json' },
            });


            console.log('ffffffaaaaaa', result.data.profile_url)
            setMainData(result.data);
            setprogileimageurl(result.data.profile_url)
            setdrname(result.data.drname || '');
            setdesignation(result.data.designation || '');
            setyearsofexperience(result.data.yearsofexperience?.toString() || '');
            setbiography(result.data.biography || '');
            setpatientchecked(result.data.patientchecked?.toString() || '');
            setinstituteName(result.data.instituteName || '');
            setregistrationNumber(result.data.registrationNumber || '');
            setaadharNumber(result.data.aadharNumber?.toString() || '');
            setdocumentArray(result.data.imgarry);

        }
        catch (error) {
            console.log(error)
            navigation.goBack();
            ToastAndroid.showWithGravityAndOffset(
                'Something went wrong, Please try again after some time!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    }


    const renderItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.imagecrusal} resizeMode="cover" showsHorizontalScrollIndicator={false} />
    );

    useEffect(() => {
        getsingleUDetaisl()
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manage Job</Text>
                </View>
            </View>
            {MainData.FormSubmitted === 'Yes' ? <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {MainData.FormSubmitted === 'Yes' && MainData.Certified !== 'Yes' &&
                    <View style={{
                        backgroundColor: '#fffbe6',
                        borderLeftWidth: 4,
                        borderLeftColor: '#f1c40f',
                        padding: 15,
                        borderRadius: 8,

                        marginVertical: 12
                    }}>
                        <Text style={{
                            color: '#b38f00',
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'left'
                        }}>
                            ⚠️ Form Already Submitted
                        </Text>
                        <Text style={{
                            color: '#9c8700',
                            fontSize: 14,
                            marginTop: 6
                        }}>
                            We’ve received your details and are currently reviewing them. You’ll hear from us soon. Thank you for your submission!
                        </Text>
                    </View>}


                {MainData.Certified === 'Yes' &&
                    <View style={{
                        backgroundColor: '#e6f9ec',
                        borderLeftWidth: 4,
                        borderLeftColor: '#28a745',
                        padding: 15,
                        borderRadius: 8,

                        marginVertical: 12
                    }}>
                        <Text style={{
                            color: '#1c7c3d',
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'left'
                        }}>
                            ✅ Application Approved
                        </Text>
                        <Text style={{
                            color: '#2e7d32',
                            fontSize: 14,
                            marginTop: 6
                        }}>
                            Congratulations! Your application has been successfully approved. You're now a verified professional on our platform and can start offering your services with full access.
                        </Text>
                    </View>}
                <View style={styles.rediusborder}>
                    <Image source={require('../assets/ImageMay9202509_11_02PM.png')} style={styles.imNg} />

                </View>

                <View style={styles.box}>
                    {/* <View style={styles.imgbox}>
                            <Image source={require('./assets/vvvb.jpg')} style={styles.img_profile_two} />
                        </View> */}
                    <View style={styles.imgbox} >
                        {progileimageurl ? <Image style={styles.img_profile_two} source={{ uri: progileimageurl }} /> : <View style={styles.logoprofile}><AntDesign name='user' size={60} color='white' /></View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.text11}>{drname} </Text>

                    </View>

                    <Text style={styles.text1}>{designation}</Text>

                </View>



                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text2}>Biography </Text>

                </View>

                <Text style={styles.text3}>{biography}</Text>


                <Text style={styles.text22}>Specialty</Text>
                <View style={styles.flexbox}>
                    <View>
                        <Text style={styles.text4}>Years of experience</Text>
                        <Text style={styles.text4}>Patients checked</Text>
                    </View>
                    <View>
                        <Image source={require('../assets/senthesiss-scope.png')} style={styles.img} />
                    </View>
                    <View>
                        <Text style={styles.text5}>{yearsofexperience} Years</Text>
                        <Text style={styles.text5}>{patientchecked}+</Text>
                    </View>
                </View>

                <View >
                    <Text style={styles.text2}>Institute Name</Text>

                </View>

                <Text style={styles.text3}>{instituteName}</Text>

                <View >
                    <Text style={styles.text2}>Registration Numbere</Text>

                </View>

                <Text style={styles.text3}>{registrationNumber}</Text>

                <View >
                    <Text style={styles.text2}>Aadhar card number</Text>

                </View>

                <Text style={styles.text3}>{aadharNumber}</Text>

                <View >
                    <Text style={styles.text2}>Adhar Card & Degree</Text>

                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingRight: 16 }}>
                    {documentArray?.map((e, id) => <TouchableOpacity style={styles.boxx} onPress={() => navigation.navigate('ImageInFullScreen', { param1: `${e.profile_url}`, param2: 'Value2' })}>
                        <Image source={{ uri: e.profile_url }} style={styles.imagecgtrusal} />
                    </TouchableOpacity>)}
                </ScrollView>

                <Text style={styles.text3}></Text>
            </ScrollView> :
                <>
                    <StepIndicator currentStep={currentStep} />
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {currentStep === 1 && <>
                            <Text style={styles.text22}>Name</Text>
                            <TextInput placeholder='Enter name here..' placeholderTextColor={'#b0b0b0'} style={styles.input}
                                value={drname} onChangeText={(text) => setdrname(text)}
                            />


                            <Text style={styles.text22}>Designation</Text>
                            <TextInput placeholder='Enter designation here..' placeholderTextColor={'#b0b0b0'} style={styles.input}
                                value={designation} onChangeText={(text) => setdesignation(text)}
                            />







                            <Text style={styles.text22}>Years of experience</Text>
                            <TextInput
                                placeholder='Enter years of experience here..'
                                placeholderTextColor={'#b0b0b0'}
                                style={styles.input}
                                keyboardType='numeric'
                                value={yearsofexperience ? yearsofexperience.toString() : ''}
                                onChangeText={(text) => {
                                    if (/^\d*$/.test(text)) {
                                        setyearsofexperience(text)
                                    }
                                }}
                            />


                            <Text style={styles.text22}>Patient checked</Text>
                            <TextInput
                                placeholder='Enter patient checked here..'
                                placeholderTextColor={'#b0b0b0'}
                                style={styles.input}
                                keyboardType='numeric'
                                value={patientchecked ? patientchecked.toString() : ''}
                                onChangeText={(text) => {
                                    if (/^\d*$/.test(text)) {
                                        setpatientchecked(text)
                                    }
                                }}
                            />

                            <Text style={styles.text22}>Institute Name</Text>
                            <TextInput
                                placeholder='Enter institute name here..'
                                placeholderTextColor={'#b0b0b0'}
                                style={styles.input}
                                value={instituteName} onChangeText={(text) => setinstituteName(text)}
                            />
                            <Text style={styles.text22}>Registration Number</Text>
                            <TextInput
                                placeholder='Enter registration number here..'
                                placeholderTextColor={'#b0b0b0'}
                                style={styles.input}
                                value={registrationNumber} onChangeText={(text) => setregistrationNumber(text)}
                            />

                            <Text style={styles.text22}>Aadhar card number</Text>
                            <TextInput
                                placeholder='Enter aadhar card number here..'
                                placeholderTextColor={'#b0b0b0'}
                                style={styles.input}
                                keyboardType='numeric'
                                value={aadharNumber ? aadharNumber.toString() : ''}
                                onChangeText={(text) => {
                                    if (/^\d*$/.test(text)) {
                                        setaadharNumber(text)
                                    }
                                }}
                            />

                            <Text style={styles.text22}>Biography</Text>
                            <TextInput placeholder='Enter biography here..' placeholderTextColor={'#b0b0b0'} style={styles.inpvtut}
                                textAlign="left"
                                multiline={true}
                                numberOfLines={4}
                                value={biography} onChangeText={(text) => setbiography(text)}
                            />
                        </>}


                        {currentStep === 2 && <>

                            <Text style={styles.text22}>Upload images of Adhar Card & Degree</Text>
                            <View style={styles.newcong}>
                                <FlatList
                                    data={datas}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    horizontal
                                />

                                {datas && <TouchableOpacity onPress={deleteselectedimage}><AntDesign name="closecircle" size={26} color="#C00000" /></TouchableOpacity>}
                            </View>


                            {datas == null ? <TouchableOpacity style={styles.uploadimg} onPress={SelectDoc}>
                                <Image source={require('./assets/Frame9347.png')} />

                                <Text style={styles.choosey}>Choose images carefully. You can upload Max 2 photos</Text>
                            </TouchableOpacity> : <TouchableOpacity style={styles.boxadd} onPress={SelectDoc}><Image source={require('./assets/Icon.png')} /><Text style={styles.addmoren}>Add Other</Text></TouchableOpacity>}
                        </>}


                        {currentStep === 3 && <>

                            <View style={styles.rediusborder}>
                                <Image source={require('../assets/ImageMay9202509_11_02PM.png')} style={styles.imNg} />

                            </View>

                            <View style={styles.box}>
                                {/* <View style={styles.imgbox}>
                            <Image source={require('./assets/vvvb.jpg')} style={styles.img_profile_two} />
                        </View> */}
                                <View style={styles.imgbox} >
                                    {progileimageurl ? <Image style={styles.img_profile_two} source={{ uri: progileimageurl }} /> : <View style={styles.logoprofile}><AntDesign name='user' size={60} color='white' /></View>}
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.text11}>{drname} </Text>
                                    <TouchableOpacity onPress={() => setcurrentStep(1)} >
                                        <FontAwesome name='pencil' color='#06aeeb' size={18} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.text1}>{designation}</Text>

                            </View>



                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.text2}>Biography </Text>

                            </View>

                            <Text style={styles.text3}>{biography}</Text>


                            <Text style={styles.text22}>Specialty</Text>
                            <View style={styles.flexbox}>
                                <View>
                                    <Text style={styles.text4}>Years of experience</Text>
                                    <Text style={styles.text4}>Patients checked</Text>
                                </View>
                                <View>
                                    <Image source={require('../assets/senthesiss-scope.png')} style={styles.img} />
                                </View>
                                <View>
                                    <Text style={styles.text5}>{yearsofexperience} Years</Text>
                                    <Text style={styles.text5}>{patientchecked}+</Text>
                                </View>
                            </View>

                            <View >
                                <Text style={styles.text2}>Institute Name</Text>

                            </View>

                            <Text style={styles.text3}>{instituteName}</Text>

                            <View >
                                <Text style={styles.text2}>Registration Numbere</Text>

                            </View>

                            <Text style={styles.text3}>{registrationNumber}</Text>

                            <View >
                                <Text style={styles.text2}>Aadhar card number</Text>

                            </View>

                            <Text style={styles.text3}>{aadharNumber}</Text>

                            <View >
                                <Text style={styles.text2}>Adhar Card & Degree</Text>

                            </View>

                            <View style={styles.newcong}>
                                <FlatList
                                    data={datas}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    horizontal
                                />

                                {datas && <TouchableOpacity onPress={() => setcurrentStep(2)} >
                                    <FontAwesome name='pencil' color='#06aeeb' size={18} />
                                </TouchableOpacity>}
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                                <TouchableOpacity
                                    onPress={() => setIsChecked(!isChecked)}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        backgroundColor: isChecked ? '#06aeeb' : 'transparent',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 10,
                                    }}
                                >
                                    {isChecked && <AntDesign name="check" size={14} color="white" />}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 15, color: '#333', flex: 1 }}>
                                    I agree to the <Text style={{ color: '#06aeeb', textDecorationLine: 'underline' }}>Terms & Conditions</Text> and <Text style={{ color: '#06aeeb', textDecorationLine: 'underline' }}>Privacy Policy</Text>.
                                </Text>
                            </View>






                            <Text style={styles.text3}></Text>

                        </>}





                    </ScrollView>

                    <View style={styles.footerbtncontainer}>

                        <TouchableOpacity style={styles.btn} onPress={() => currentStep === 1 ? navigation.goBack() : setcurrentStep(currentStep - 1)}>
                            <Text style={styles.btnbetext}>Back</Text>
                        </TouchableOpacity>
                        {currentStep === 3 ? <LinearGradient
                            colors={['#06aeeb', '#4ccdfc']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.clickbtn}
                        ><TouchableOpacity style={{ alignItems: 'center', width: '100%', height: 'auto', paddingVertical: 12 }} onPress={() => uploadImages()}
                            disabled={isLoading}
                        >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.clickbtntext}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </LinearGradient> : <LinearGradient
                            colors={['#06aeeb', '#4ccdfc']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.clickbtn}
                        >
                            <TouchableOpacity style={{ alignItems: 'center', width: '100%', height: 'auto', paddingVertical: 12 }} onPress={handleNextStep}>
                                <Text style={styles.clickbtntext}>Next</Text>
                            </TouchableOpacity>
                        </LinearGradient>}



                    </View></>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    boxx: {
        backgroundColor: '#fff',
        borderRadius: 16,

        marginBottom: 16,
        borderColor: '#C7C7C7',
        borderWidth: 1,
        marginTop: 18,
        marginRight: 12
    },
    imgthree: {
        width: '100%',
        height: 250,
        aspectRatio: 1,
        borderRadius: 8
    },
    text4: {
        color: '#132F4D',
        fontSize: 16,
        marginTop: 8,
        fontFamily: 'Poppins-Regular'
    },
    text5: {
        color: '#132F4D',
        fontSize: 16,
        // fontWeight: '700',
        fontFamily: 'Poppins-Medium',
        marginTop: 8,
        textAlign: 'right'
    },
    flexbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text1: {
        fontSize: 16,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',

    },
    text11: {
        fontSize: 19,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',

    },
    box: {
        alignItems: 'center'
    },
    logoprofile: {
        marginBottom: 12,
        borderRadius: 250,
        padding: 20,
        backgroundColor: '#D7D7D7',
        height: 110,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_profile_two: {
        height: 110,
        width: 110,
        borderRadius: 250,
        marginBottom: 12
    },
    imgbox: {
        marginTop: -70,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 100
    },
    rediusborder: {
        borderRadius: 25,
        height: 150,
        overflow: 'hidden'
    },
    imNg: {
        width: '100%', aspectRatio: 1.3, resizeMode: 'contain', height: 'auto',
        marginTop: -50
    },
    newcong: {
        marginTop: 24,
        flexDirection: 'row',

    },
    imagecrusal: {
        width: 148,
        height: 148,
        borderColor: '#D7D7D7',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 16
    },
    imagecgtrusal: {
        width: 148,
        height: 148,
        borderColor: '#D7D7D7',
        borderWidth: 1,
        borderRadius: 8,

    },
    img: {
        height: 100
    },
    uploadimg: {
        marginVertical: 10,
        backgroundColor: '#F0F0F0',
        display: 'flex',
        paddingTop: 12,
        alignItems: 'center',
        paddingHorizontal: 27,
        paddingBottom: 21,
        borderRadius: 16
    },
    uploadtext: {
        fontSize: 16,
        color: '#636363',
        textAlign: 'center'
    },
    choosey: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
        color: '#636363'
    },
    boxadd: {
        marginTop: 24,
        width: 148,
        height: 148,
        borderColor: '#D7D7D7',
        borderWidth: 1,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    footerbtncontainer: {
        padding: 16,
        backgroundColor: 'transparent',
        // borderTopColor: '#d7d7d7',
        // borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    btn: {
        // paddingVertical: 12,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#06aeeb',
        backgroundColor: 'white',
        borderRadius: 50,
        justifyContent: 'center'
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
    inpvtut: {
        // paddingHorizontal: 4,
        fontSize: 16,
        backgroundColor: '#f7f7fb',
        borderRadius: 16,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 12,
        textAlignVertical: 'top',
        marginBottom: 16,
        marginTop: 8
    },
    text22: {
        marginTop: 10,
        fontSize: 16,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
    },
    text2: {
        fontSize: 17,
        // fontWeight:'900',
        color: '#132F4D',
        fontFamily: 'Poppins-Medium',
        // marginBottom: 10
    },
    text3: {
        color: '#132F4D',
        fontSize: 15,
        marginBottom: 16,
        fontFamily: 'Poppins-Regular'
    },
    header: {
        backgroundColor: '#06aeeb',
        paddingTop: 22,
        paddingBottom: 12,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Poppins-Medium',
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#132F4D',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: '#132F4D',
        fontFamily: 'Poppins-Regular',
        lineHeight: 24,
    },
    footer: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
});

export default ManageJob; 
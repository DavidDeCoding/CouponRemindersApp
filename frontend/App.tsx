import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { ListItem, Button, Text, colors, withTheme } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Amplify, { API, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';

const COUPON_REMINDERS_BACKEND_NAME = "CouponRemindersBackend";
const COUPON_REMINDERS_BACKEND_ADD_COUPON_PATH   = "/addCoupon";
const COUPON_REMINDERS_BACKEND_GET_COUPONS_PATH  = "/getCoupons";

Amplify.configure({
    Auth: {
        region: 'us-west-1',
        userPoolId: 'us-west-1_s4rOJ0zxo',
        userPoolWebClientId: '70d9qekok8i0r4vc9dbpntq29m',
        oauth: {
            domain: 'service-user-pool-domain-stagging-coupon-reminders.auth.us-west-1.amazoncognito.com',
            scope: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
            redirectSignIn: 'http://localhost:3000',
            redirectSignOut: 'http://localhost:3000',
            responseType: 'code'
        }
    },
    API: {
        endpoints: [{
            name: COUPON_REMINDERS_BACKEND_NAME,
            endpoint: "https://t38hqd6fq0.execute-api.us-west-1.amazonaws.com"
        }]
    },
    Analytics: {
        disabled: true,
    }
});

type AppProps = {};

const App: React.FunctionComponent<AppProps> = () => {
    // 1. Storing the image in memory.
    const [image, setImage] = useState(null);

    // 2. Asking for permission to use the Camera App.
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need permissions to use your camera to make this work!')
                }
            }
        })();
    }, []);

    // 3. Clicking Picture with Image Picker Plugin.
    const takePicture = async () => {
        const img = await ImagePicker
            .launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            .then(async response => {
                if (response.cancelled) {
                    const error = 'Image Clicking cancelled.';
                    return Promise.reject(error);
                }
                const imgContainer = await fetch(response.uri);
                const img = await imgContainer.blob();
                return img;
            })
            .catch(error => console.log(error));

        const addCouponRequestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
            },
            body: { "user_id": "test" }
        }
        const s3URL = await API
            .post(COUPON_REMINDERS_BACKEND_NAME, COUPON_REMINDERS_BACKEND_ADD_COUPON_PATH, addCouponRequestOptions)
            .then(async response => {
                return response['url'];
            })
            .catch(error => console.error(error));

        const s3UploadRequestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: img
        };
        await fetch(s3URL, s3UploadRequestOptions)
            .then(async response => {
                const data = await response.text();

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
            .catch(error => console.error(error));
    };

    // 6. List Uploaded Coupons
    const [couponList, setCouponList] = useState([]);

    useEffect(async () => {
        const getCouponsRequestOptions = {
            headers: {
                'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
            }
        };
        await API
            .get(COUPON_REMINDERS_BACKEND_NAME, COUPON_REMINDERS_BACKEND_GET_COUPONS_PATH + "/test", getCouponsRequestOptions)
            .then(async response => {
                setCouponList(response['coupons']);
            })
            .catch(error => console.log(error));
    });


    const renderItem = ({ item }) => (
        <View>
            <Text>{item.title}</Text>
        </View>
    );

    return (
        <>
            <View style={styles.container}>
                <Text styles={styles.header}>Coupon Reminders</Text>
                <ScrollView style={styles.list}>
                {
                    couponList.map((elem, i) => (
                        <ListItem key={i} bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title>{elem.name}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Content right>
                                <ListItem.Title>{elem.expires_on}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
                </ScrollView>
                <View style={styles.buttonsContainer}>
                    <Button
                        title='ADD COUPON'
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(90, 154, 230, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10
                        }}
                        onPress={takePicture}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: "#2089dc",
        color: "white",
        textAlign: "center",
        paddingVertical: 5,
        marginBottom: 10
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
        position: 'absolute',
        bottom: 0
    },
    list: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: colors.greyOutline
    }
});

export default withTheme(withAuthenticator(App), '');

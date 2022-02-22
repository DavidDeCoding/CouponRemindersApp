import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { ListItem, Button, Text, colors, withTheme } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

type AppProps = {};

const COUPON_REMINDERS_BACKEND              = "https://h8lwm7xnpi.execute-api.us-west-1.amazonaws.com/"
const COUPON_REMINDERS_BACKEND_ADD_COUPON   = COUPON_REMINDERS_BACKEND + "addCoupon";
const COUPON_REMINDERS_BACKEND_GET_COUPONS  = COUPON_REMINDERS_BACKEND + "getCoupons";
const AUTH_TOKEN = 'Bearer ' + 'eyJraWQiOiJzRk1cL1hQVldyY3V5cjBpVk1TaE5SZnIyNFFlakJ2bGgyVTAwaVNKTEVGdz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiOUVURHpBdzBaZVFWTzFRekFwX0RWQSIsInN1YiI6IjJjMDU4ZjNlLTA0ZWItNDhkMS1iOWQxLTVhMGZkYzBmYjRmYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV85bmNPcTJRejUiLCJjb2duaXRvOnVzZXJuYW1lIjoiMmMwNThmM2UtMDRlYi00OGQxLWI5ZDEtNWEwZmRjMGZiNGZhIiwiYXVkIjoiNTV2M3M5YTR0cGk1YmlrMmFtcWI5MW11NnIiLCJldmVudF9pZCI6ImVkOGQ4MTI5LWY4ZjctNGYyMC1hYWZlLWJiMTI5OGEzNjdjOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ1NDkzMDE4LCJleHAiOjE2NDU0OTY2MTgsImlhdCI6MTY0NTQ5MzAxOCwianRpIjoiOWQxNGYwZWItN2Y5My00ZmM3LWJiN2UtYWM1NzhlMzdlZGE0IiwiZW1haWwiOiJkYXZpZGRlY29kaW5nQGdtYWlsLmNvbSJ9.oa5bCxEu-QQOFG165U5Si1FISvRSDixdSN8Clg7m__rd8f9C_KWeadV_7RgKMyglK6bkXKgNIYGmzL7iI2XaO9fFBW04DOfS3byi6Y4aEaQAMgAJuGGqzIgSizpnKDa5eO5n4NJ7qlwshVn-cek0YaR4g7DZF0vyav0mdL1iknachmDc33yZOnwxFi_Z97AZQDikKlDRobJjDqgemAvAgsnO040SHEYPNQDXfEeonBCkNOPZ9rCeWhf60fMsnj_nck7FD61imPC4S95RZr7O19m-MNf-NQCJltkXDLRgRZQRcArsVf3_AcT1IwOzKVTKPFoPz1xKyR9NEcOo-5LB0Q';

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

        const s3URLRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            body: JSON.stringify({ "user_id": "test" })
        }
        const s3URL = await fetch(COUPON_REMINDERS_BACKEND_ADD_COUPON, s3URLRequestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                const s3URL = data['url'];

                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                return s3URL;
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

                console.log(data);
            })
            .catch(error => console.error(error));
    };

    // 6. List Uploaded Coupons
    const [couponList, setCouponList] = useState([]);

    useEffect(async () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': AUTH_TOKEN
            }
        };
        const response = await fetch(COUPON_REMINDERS_BACKEND_GET_COUPONS + "/test", requestOptions);
        const data = await response.json();
        setCouponList(data['coupons']);
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

export default withTheme(App, '');

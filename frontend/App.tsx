import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, SafeAreaView, FlatList, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
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
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            console.log(result.uri);
            await uploadToS3(result);
        }
    };

    const uploadToS3 = async (result) => {
        const img = await fetch(result.uri);
        const imgBlob = await img.blob();

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: imgBlob
        };
        await fetch(
                '',
                requestOptions)
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    };

    const data = [
        {id: 1, title: 'Coupon 1'},
        {id: 2, title: 'Coupon 2'},
        {id: 3, title: 'Coupon 3'}
    ];

    const renderItem = ({ item }) => (
        <View>
            <Text>{item.title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View>
                <Button
                    title="+"
                    onPress={takePicture}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

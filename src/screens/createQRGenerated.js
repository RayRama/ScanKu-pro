import {StyleSheet, Text, View, ScrollView, Button, Image} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import RNQRGenerator from 'rn-qr-generator';
import {useSafeArea} from 'react-native-safe-area-context';

import {RowItem, RowSeparator} from '../component/rowItem';
import {Ionicons} from '@expo/vector-icons';

export default function GenerateQR({navigation, route = {}}) {
  const params = route.params || {};
  const {data} = params;
  const insets = useSafeArea();

  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  // Handle URL string
  let newData = data.replace(/(^\w+:|^)\/\//, '');

  useLayoutEffect(() => {
    generateQR();
  }, []);

  // let svg;

  // const test = async () => {
  //   svg.toDataURL((data) => {
  //     const shareImageBase64 = {
  //       title: "QR",
  //       message: "Ehi, this is my QR code",
  //       url: `data:image/png;base64,${data}`,
  //     };
  //     setImageUri(data);
  //     // Share.share(shareImageBase64);
  //   });
  //   await Sharing.shareAsync("file:///storage/emulated/0/Pictures/t.png");
  // };
  // console.log(typeof data);

  const generateQR = () => {
    // console.log(newData);
    // console.log(data);
    RNQRGenerator.generate({
      value: data,
      height: 300,
      width: 300,
      base64: true,
      backgroundColor: 'white',
      color: 'black',
      correctionLevel: 'M',
      // fileName: `${newData}_ScanKu`,
    })
      .then(res => {
        console.log('response:', res);
        setImageUri({uri: res.uri});
        // console.log(typeof imageUri);
        setBase64Image(res.base64);
        // console.log(imageUri);
      })
      .catch(err => console.log('Cannot create QR code', err));
  };

  const shareImage = async () => {
    const options = {
      title: 'Share image',
      message: `Content data: ${data}`,
      url: `data:image/png;base64,${base64Image}`,
    };
    await Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* QR Code image  */}
          <View style={styles.qrResult}>
            {/* <QRCode
              value={data}
              size={250}
              getRef={c => (svg = c)}
              quietZone={1}
            /> */}
            <Image style={{width: 300, height: 300}} source={imageUri} />
          </View>

          {/* Text data  */}
          <View style={styles.textData}>
            <Text style={{fontSize: 16, color: '#222', textAlign: 'center'}}>
              {data}
            </Text>
          </View>

          {/* Save as image */}
          <RowItem
            title="Save as Image"
            onPress={() => alert('data')}
            leftIcon={
              <View
                style={{
                  backgroundColor: 'green',
                  height: 36,
                  width: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="ios-save" size={18} color="white" />
              </View>
            }
          />
          <RowSeparator />

          {/* Share Image  */}

          <RowItem
            title="Share Image"
            onPress={() => shareImage()}
            leftIcon={
              <View
                style={{
                  backgroundColor: 'green',
                  height: 36,
                  width: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="share-social" size={18} color="white" />
              </View>
            }
          />
          <RowSeparator />

          {/* Go back */}
          <RowItem
            title="Go back"
            onPress={() => navigation.navigate('MainApp')}
            leftIcon={
              <View
                style={{
                  backgroundColor: 'green',
                  height: 36,
                  width: 36,
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="arrow-back" size={18} color="white" />
              </View>
            }
          />
          <RowSeparator />

          <View style={{paddingBottom: insets.bottom}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qrResult: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  textData: {
    flex: 1,
    marginVertical: 20,
  },
});

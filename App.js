import React from 'react';
import {
    useRef,
} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import WebviewContainer from './WebviewContainer';
import TestScreen from './TestScreen';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Share,
    View,
    Platform,
} from 'react-native';

import { WebView } from 'react-native-webview';
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Linking from 'expo-linking';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();



const Stack = createStackNavigator();//네비게이터

const prefix = Linking.createURL('/');//이거쓰는이유: 모드에따라 url이 달라서
//딥링크 위한 포함


const App = () => {


  const linking = {
    prefixes: [
      'bankidz://mypage',
      'http://bankidz.com'
    ],
    config: {

    }
  };//딥링크 때문에
  

    const INJECTED_JAVASCRIPT = `(function() {
        const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
      })();`;//화면확대 방지용 코드
      
 


    registerForPushNotificationsAsync = async () => {//토큰받기
        // #Block_1
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }       
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
            return token; 
        }

        else {
            console.log('Must use physical device for Push Notifications');
        }// 실제 기기만 토큰받기 가능

        // #Block_2
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };//안드로이드 확인


  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();

  /** 웹뷰 ref */
  const handleSetRef = _ref => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  const handleEndLoading = async (e) => {
    console.log("handleEndLoading");
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    const expotoken = await registerForPushNotificationsAsync();
    console.log("제대로 들어왔나?", expotoken)
    webviewRef.current.postMessage(expotoken);// 이게 여기서 돌아가게하면 
    console.log("이게나중인데")

  };

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = ({ nativeEvent: { data } }) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    const invitelink = /*"http://" +*/ data;
    //Vibration.vibrate()
    if (Platform.OS === 'android'){
    Share.share({
      title: "가족의 그룹 링크를 공유했어요, 확인해보세요!\n",
      message:  invitelink//"http://play.google.com/app" // 앱번호확인후 기재
    })
  }
  if (Platform.OS === 'ios'){
    Share.share({
      title: "가족의 그룹 링크를 공유했어요, 확인해보세요!\n",
      message: "https://bankidzapp.page.link/?link=http://bankidz.com/mypage&apn=com.bankidz.bankidzapp&isi=6444064518&ibi=com.bankidz.bankidzapp&efr=1"
    })
  }
  };

  const url = "https://bankidz.com";
  

    return (
      <NavigationContainer    
      linking={{
        prefixes: [prefix],
        config: {
          screens: { 
            // HomeStack 내에 포함된 components 중 path를 부여하고 싶은 것만 작성합니다.
            // :roomId 에 들어가는 값은 navigation의 params로 전달됩니다.
            ChatRoom: "room/:roomId",
          },
        },
        // ...
      }}>

        <View style={styles.root}>
            <View style={styles.browser}>
            <SafeAreaView style={{ flex: 1 , backgroundColor: 'white' }}>
                        <StatusBar barStyle="dark-content" backgroundColor={'white'} /*translucent={false}*/ />
                    
                        <WebviewContainer
                          injectedJavaScript={INJECTED_JAVASCRIPT}
                          allowsbackforwardnavigationgestures={true}
                          scalesPageToFit={true}        
                          sharedCookiesEnabled={true}  
                          webviewRef={webviewRef}
                          handleSetRef={handleSetRef}
                          handleOnMessage={handleOnMessage}
                          handleEndLoading={handleEndLoading}
                          />

                </SafeAreaView>
            </View>
        </View>  
        </NavigationContainer>
    );
};


const styles = StyleSheet.create({

    browser: {
        flex: 1,
    },
    root: {
        flex: 1,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 18,
        fontWeight: "bold"
    }
});

export default App;

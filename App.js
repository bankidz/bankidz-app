import React from 'react';
import {
    useEffect,
    useState,
    useRef,
    Component
} from 'react';
import { 
    NavigationContainer,
    useFocusEffect
 } from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import WebviewContainer from './WebviewContainer';

import {
    Alert,
    BackHandler,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    navstate,
    Button,
    Vibration,
    Platform,
    navigation,
    ToastAndroid 
} from 'react-native';

import { WebView } from 'react-native-webview';
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Linking from 'expo-linking';
import GestureRecognizer from 'react-native-swipe-gestures';



const Stack = createStackNavigator();//네비게이터

const prefix = Linking.createURL('/');//이거쓰는이유: 모드에따라 url이 달라서
//딥링크 위한 포함

const App = () => {

  const linking = {
    prefixes: [prefix],
  };//딥링크 때문에
  

    const INJECTED_JAVASCRIPT = `(function() {
        const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
      })();`;//화면확대 방지용 코드
    const [mainUrl, setMainUrl] = useState(url); 
    const webview = useRef(null);

    const onUrlChange = (ref) => {
      setMainUrl(ref);
    }
      let time = 0; // 맨트 노출 시간
      const onAndroidBackPress = () => {
        if (!webview.current) {
          return;
        }
          console.log("뒤로가기")
          webview.current.goBack(); // 최상이 url이 아닌경우 웹페이지 뒤로가기
          return true;

      };//안드로이드 뒤로가기?

      useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
        };
      }, [mainUrl]);//안드로이드 뒤로가기?
    


    /* const handlePressBack = () => {
         if (navigation?.canGoBack()) {
             navigation.goBack() // 스크린 props 로 생성된 네비통한 뒷페이지 이동
             return true
         }
         return false
     }
     
     useEffect(() => {
         BackHandler.addEventListener('hardwareBackPress', handlePressBack)
         return () => {
             BackHandler.removeEventListener('hardwareBackPress', handlePressBack)
         }
     }, [handlePressBack]) // 뒤로가기가 앱종료가아닌 이전화면으로 넘어감
     //테스트용 뒤로가기 
     */

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
                alert('Failed to get push token for push notification!');
                return;
            }
            
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
            webviewRef.postMessage(token);
            this.setState({ expoPushToken: token });
        }


        else {
            alert('Must use physical device for Push Notifications');
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

    useEffect(() => {//토큰!
        registerForPushNotificationsAsync();
    }, [])

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();

  /** 웹뷰 ref */
  const handleSetRef = _ref => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  const handleEndLoading = e => {
    console.log("handleEndLoading");
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
   // webviewRef.postMessage("로딩 완료시 webview로 정보를 보내는 곳");
    console.log("들어오는지테스트");
    //webviewRef.postMessage("들어오는지테스트")
  };
  const url = "http://bankidz.com/";
    //"http://bankidz.com"

  const WebviewContainer = ({ handleSetRef, handleEndLoading }) => {
    /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
    const handleOnMessage = ({ nativeEvent: { data } }) => {
      // data에 웹뷰에서 보낸 값이 들어옵니다.
      console.log(data);
      console.log("forthetest");
    };
  
    return (
      <WebView
        onLoadEnd={handleEndLoading}
        onMessage={handleOnMessage}
        ref={handleSetRef}
        source={{ uri: url }}
      />
    );
  };


    return (
  /*    <NavigationContainer      
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
       }} // 네비게이션을 통한 딥링크라는데..
      >
       <Stack.Navigator>{/* ... */
    

        <View style={styles.root}>
            <View style={styles.browser}>
            <SafeAreaView style={{ flex: 1 , backgroundColor: '#FAFAFC' }}>
                        <StatusBar barStyle="dark-content" backgroundColor={'transparent'} /*translucent={false}*/ />
                        <WebView style={{flex:1}}//style = {{position: 'absolute'}}
                        source={{ uri: url}}
                        injectedJavaScript={INJECTED_JAVASCRIPT}
                        ref={webview}
                        allowsbackforwardnavigationgestures={true}
                        scalesPageToFit={true}        
                        sharedCookiesEnabled={true}

                        />                        
                        {/* <WebviewContainer */}
                          {/* webviewRef={webviewRef} */}
                          {/* handleSetRef={handleSetRef} */}
                          {/* handleEndLoading={handleEndLoading} */}
                          {/* /> */}

                </SafeAreaView>
            </View>
        </View>  
//}
    //    </Stack.Navigator>
  //  </NavigationContainer>
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

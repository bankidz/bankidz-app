import { WebView } from "react-native-webview";
import * as Linking from 'expo-linking';
import { useRef, useEffect, useState } from "react";
import { BackHandler } from "react-native";

const WebviewContainer = ({ webviewRef , handleOnMessage, handleEndLoading }) => {
  const url = "https://bankidz.com/auth/login";

  // /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  // const handleOnMessage = ({ nativeEvent: { data } }) => {
  //   // data에 웹뷰에서 보낸 값이 들어옵니다.
  //   invitelink = data;
  //   console.log(invitelink);
  // };
   const [mainUrl, setMainUrl] = useState(url); 

 // let webviewRef = useRef();

  const onAndroidBackPress = () => {
    if (!webviewRef.current) {
      return;
    }
      console.log("뒤로가기")
      webviewRef.current.goBack(); // 최상이 url이 아닌경우 웹페이지 뒤로가기
      return true;

  };//안드로이드 뒤로가기?

  const onNavigationStateChange = navState => {
    webviewRef.canGoBack = navState.canGoBack;
    if (navState.url.includes("https://pf.kakao.com/_LjxjVxj")) {
      // 새 탭 열기
      Linking.openURL(navState.url);
      return false;
    }
  };

  // 이 함수를 작동시키지 않으면 stopLoading() 문제로 인해 안드로이드에서 소스페이지의 다른 링크를 탭할 수 없습니다. 그래서 stopLoading를 방지하기 위해 아래 함수를 실행합니다.
  const onShouldStartLoadWithRequest = event => {
    if (event.url.includes("https://pf.kakao.com/_LjxjVxj")) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, [mainUrl]);//안드로이드 뒤로가기?

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={webviewRef}
      // 웹뷰 로딩이 시작되거나 끝나면 호출하는 함수 navState로 url 감지
      onNavigationStateChange={onNavigationStateChange}
      // 처음 호출한 URL에서 다시 Redirect하는 경우에, 사용하면 navState url 감지
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      source={{ uri : url}}
    />
  );
};

export default WebviewContainer;
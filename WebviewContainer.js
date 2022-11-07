import { WebView } from "react-native-webview";
import { useRef, useEffect, useState } from "react";
import { BackHandler } from "react-native";

const WebviewContainer = ({ webviewRef , handleOnMessage, handleEndLoading }) => {
  const url = "https://bankidz.com";

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
      source={{ uri : url}}
    />
  );
};

export default WebviewContainer;
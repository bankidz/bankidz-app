export default function Routes() {
    return (
      <Router>
        <RNListener>
        <Switch>
          ...
        </Switch>
        </RNListener>

      </Router>
    )
  }
  const RNListener = () => {
  /** react native 환경에서만 가능 */
  const listener = event => {
    const { data, type } = JSON.parse(event.data);
    if (type === "TOKEN") {
      // type이 TOKEN이기 때문에 이곳에 콘솔이 찍히게 됩니다.
      console.log(data) // xxxxx
      
    } else if (type === "NOTIFICATION") {
      
    }
  };

  if (window.ReactNativeWebView) {
    /** android */
    document.addEventListener("message", listener);
    /** ios */
    window.addEventListener("message", listener);
  } else {
    // 모바일이 아니라면 모바일 아님을 alert로 띄웁니다.
    alert({ message: ERROR_TYPES.notMobile });
  }
};
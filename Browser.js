import React, { Component } from "react";
import {
    StatusBar,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import arrowBackIcon from './assets/arrow_back.png';
import arrowNextIcon from './assets/arrow_next.png';

// initial url for the browser
const url = "https://bankidz.com";

// javascript to inject into the window
const injectedJavaScript = `
      window.ReactNativeWebView.postMessage('injected javascript works!');
      true; // note: this is required, or you'll sometimes get silent failures   
`;

class Browser extends Component {
    state = {
        currentURL: url,
        canGoForward: false,
        canGoBack: false,
        browserRef: null
    };


    // go to the next page
    goForward = () => {
        if (this.browserRef && this.state.canGoForward) {
            this.browserRef.goForward();
        }
    };

    // go back to the last page
    goBack = () => {
        if (this.browserRef && this.state.canGoBack) {
            this.browserRef.goBack();
        }
    };

    // set the reference for the browser
    setBrowserRef = (browser) => {
        if (!this.browserRef) {
            this.browserRef = browser
        }
    };

    // called when there is an error in the browser
    onBrowserError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent)
    };

    // called when the webview is loaded
    onBrowserLoad = (syntheticEvent) => {
        const { canGoForward, canGoBack, title } = syntheticEvent.nativeEvent;
        this.setState({
            canGoForward,
            canGoBack,
            title
        })
    };

    // called when the navigation state changes (page load)
    onNavigationStateChange = (navState) => {
        const { canGoForward, canGoBack, title } = navState;
        this.setState({
            canGoForward,
            canGoBack,
            title
        })
    };

    // called when the browser sends a message using "window.ReactNativeWebView.postMessage"
    onBrowserMessage = (event) => {
        console.log('*'.repeat(10));
        console.log('Got message from the browser:', event.nativeEvent.data);
        console.log('*'.repeat(10));
    };

    render() {
        const { state } = this;
        const { currentURL, canGoForward, canGoBack } = state;
        return (
            <View style={styles.root}>
                <View style={{ flex: 0.1, backgroundColor: '#000000' }}>
                    <StatusBar hidden={false} barStyle="dark-content" translucent={true} />
                </View>
                <View style={styles.browserContainer}>
                    <WebView
                        ref={this.setBrowserRef}
                        originWhitelist={['*']}
                        source={{ uri: currentURL }}
                        onNavigationStateChange={this.onNavigationStateChange}
                        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
                        onShouldStartLoadWithRequest={this.filterRequest}

                    />
                </View>
                <View style={styles.browserBar}>



                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            style={[styles.icon, canGoBack ? {} : styles.disabled]}
                            source={arrowBackIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.goForward}>
                        <Image
                            style={[styles.icon, canGoForward ? {} : styles.disabled]}
                            source={arrowNextIcon} />
                    </TouchableOpacity>




                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    browser: {
        flex: 1,
    },
    root: {
        flex: 1,
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: 'white',
        resizeMode: 'contain'
    },
    disabled: {
        opacity: 0.3
    },
    browserBar: {
        flex: 0.15,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 60,
        justifyContent: 'space-between',
    },
    browserContainer: {
        flex: 2,
    }
});

export default Browser;
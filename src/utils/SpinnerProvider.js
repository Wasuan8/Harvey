import LottieView from 'lottie-react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View,  } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  const showSpinner = () => {
    setIsSpinnerVisible(true);
  };

  const hideSpinner = () => {
    setIsSpinnerVisible(false);
  };



  return (
    <SpinnerContext.Provider
      value={{ isSpinnerVisible, showSpinner, hideSpinner }}
    >
      {children}
      {isSpinnerVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // optional overlay background
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LottieView style={{ height: hp('40'), width: '50%', alignSelf:'center' }} source={require("../../assets/Animation/Loader.json")} autoPlay loop />

        </View>
      )}
    </SpinnerContext.Provider>
  );
};

export const useSpinnerContext = () => {
  return useContext(SpinnerContext);
};

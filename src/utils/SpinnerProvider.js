import LottieView from 'lottie-react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'; // Updated import

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
          <LottieView
            style={{ height: verticalScale(160), width: '50%', alignSelf: 'center' }} // Updated height
            source={require("../../assets/Animation/Loader.json")}
            autoPlay
            loop
          />
        </View>
      )}
    </SpinnerContext.Provider>
  );
};

export const useSpinnerContext = () => {
  return useContext(SpinnerContext);
};
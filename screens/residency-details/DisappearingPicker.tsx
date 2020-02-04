import React from 'react';
import { Animated } from 'react-native';
import DatePicker, { DatePickerProps } from '../../components/DatePicker';
import withDelayedUnmount from '../../hocs/withDelayedUnmount';

interface Props extends DatePickerProps {
  scale: Animated.AnimatedValue;
  isOpen: boolean;
  date: ShortDate | null;
  minDate: ShortDate;
}

const DisappearingPicker = ({
  scale,
  isOpen,
  date,
  minDate,
  ...rest
}: Props) => {
  return (
    <Animated.View
      style={{
        marginTop: scale.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 0],
        }),
        zIndex: -1,
      }}
    >
      <DatePicker
        isVisible={isOpen}
        date={date || minDate}
        minDate={minDate}
        {...rest}
      />
    </Animated.View>
  );
};

export default withDelayedUnmount(DisappearingPicker);

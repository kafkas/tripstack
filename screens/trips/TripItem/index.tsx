import React, { ReactElement } from 'react';
import { View } from 'react-native';
import Flag from '../../../components/Flag';
import Icon from '../../../components/Icon';
import Text from '../../../components/Text';
import TouchableRect from '../../../components/TouchableRect';
import Trip from '../../../data-types/Trip';
import styles from './styles';

interface TripProps {
  trip: Trip;
  onPress: () => void;
}

function TripItem({ trip, onPress }: TripProps): ReactElement {
  const duration = trip.getDuration();
  const cities = trip.getCities();

  return (
    <TouchableRect onPress={onPress} style={styles.touchable}>
      <View style={styles.container}>
        <Text style={styles.title}>{trip.describePeriod()}</Text>
        <View style={styles.flags}>
          {cities.map(
            (city, index): ReactElement => (
              <View
                key={index.toString()}
                style={[styles.flag, { marginLeft: index > 0 ? 5 : 0 }]}
              >
                <Flag countryCode={city.getCountryCode()} scale={0.8} />
              </View>
            )
          )}
        </View>
        <Text style={styles.cityNames}>
          {cities.map(city => city.getName()).join(', ')}
        </Text>
        <View style={styles.baseCityContainer}>
          <Icon name='location-pin' size={18} />
          <Text style={styles.baseCityName}>
            {trip.getBaseCity().getName()}
          </Text>
        </View>
      </View>
      <Text style={styles.dayCount}>{`${duration} d`}</Text>
    </TouchableRect>
  );
}

export default React.memo(TripItem);

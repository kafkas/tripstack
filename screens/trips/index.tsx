import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { FlatList, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import TripItem from './TripItem';
import { ReduxRoot } from '../../reducers';
import * as Actions from '../../actions/sync';
import { Action, Dispatch } from '../../actions';
import StringUtil from '../../util/StringUtil';
import { MENU_BUTTON } from '../../styles/elements';
import TripStack, {
  IncompleteTravelHistoryError,
  TravelDateConflictError,
  ResidencyNotExistsError,
} from '../../data-types/TripStack';
import Trip from '../../data-types/Trip';
import styles from './styles';

const mapStateToProps = (state: ReduxRoot) => ({
  travelHistory: state.data.travelHistory,
  residencies: state.data.residencies,
  progress: state.sync.progress,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators(
    {
      sync: Actions.syncDeviceWithCloudAndRefresh,
    },
    dispatch
  );

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

let TripsScreen = ({
  travelHistory,
  residencies,
  sync,
  progress,
  navigation,
}: Props): ReactElement => {
  let trips: Trip = [];
  let totalDaysAway: number;
  let listEmptyMessage: string | null = null;

  const travels = travelHistory.getTravels();

  if (residencies.length === 0) {
    listEmptyMessage =
      'Add your past residencies in Account/Residency History to start generating trips.';
  } else if (travels.length === 0) {
    listEmptyMessage = 'No travels to generate trips from.';
  } else {
    try {
      const tripstack = new TripStack(residencies, travels);
      trips = tripstack.getTrips();
      totalDaysAway = tripstack.getTotalDuration();
    } catch (err) {
      if (err instanceof IncompleteTravelHistoryError) {
        listEmptyMessage = `It seems that you visited additional cities after your arrival to ${err.lastDestination.getName()} on ${err.lastArrival.toString()}. Please add all your travels so we can create your trips.`;
      } else if (err instanceof TravelDateConflictError) {
        listEmptyMessage = `Something doesn't quite add up... You left ${err.origin.getName()} on ${err.departure.toString()} before your arrival there on ${err.lastArrival.toString()}? Please make sure your departure and arrival dates are correct.`;
      } else if (err instanceof ResidencyNotExistsError) {
        const { period } = err;
        listEmptyMessage = `You must have a residency that covers ${
          period.getLength() === 0
            ? period.getFrom().asDayAndShortMonthAndYear()
            : `the period ${period}`
        }.`;
      } else {
        listEmptyMessage =
          'Sorry, we cannot compute your Tripstack at this time. The reason is unknown.';
      }
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trips.reverse()}
        renderItem={({
          item: trip,
          index,
        }: {
          item: Trip;
          index: number;
        }): ReactElement => (
          <TripItem
            key={index.toString()}
            trip={trip}
            onPress={(): void => {
              navigation.navigate('TripDetailsScreen', { trip });
            }}
          />
        )}
        onRefresh={sync}
        refreshing={progress.status === 'REQUEST'}
        ListEmptyComponent={
          <View style={styles.listEmptyContainer}>
            <Text style={styles.listEmptyText}>{listEmptyMessage}</Text>
          </View>
        }
        ListHeaderComponent={
          trips.length !== 0 && (
            <View style={styles.listHeaderContainer}>
              <Text style={styles.listHeaderText}>
                {StringUtil.pluralise('trip', trips.length, true)}
              </Text>
              <Text style={styles.listHeaderText}>
                {`${totalDaysAway} days away`}
              </Text>
            </View>
          )
        }
        keyExtractor={(item, index): string => index.toString()}
      />
    </View>
  );
};

TripsScreen = React.memo(TripsScreen);

TripsScreen.navigationOptions = {
  headerTitle: 'Tripstack',
  headerLeft: MENU_BUTTON,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TripsScreen);

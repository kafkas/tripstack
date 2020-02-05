import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Alert, Animated } from 'react-native';
import { bindActionCreators } from 'redux';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import ButtonOpacity from '../../components/Button/Opacity';
import ButtonHighlight from '../../components/Button/Highlight';
import CitySelector from '../../components/CitySelector';
import DatePicker from '../../components/DatePicker';
import FormContainer from '../../components/FormContainer';
import SwitchView from '../../components/SwitchView';
import DisappearingPicker from './DisappearingPicker';
import SaveButton from './SaveButton';
import City from '../../data-types/City';
import Residency, {
  ResidencyCandidate,
  MultipleCurrentsError,
  ConflictInPeriodsError,
} from '../../data-types/Residency';
import ShortDate from '../../data-types/ShortDate';
import { ReduxRoot } from '../../reducers';
import * as Actions from '../../actions/forms';
import { Action, Dispatch } from '../../actions';
import { SECTION_APPEAR_DURATION } from '../../styles/animations';
import { BLUE_COLOR, RED_COLOR } from '../../styles/colors';
import styles, { PROGRESS_HIDE_DURATION } from './styles';

/* eslint-disable react-hooks/exhaustive-deps */

const RESIDENCY_MIN_LENGTH = 1;

const mapStateToProps = (state: ReduxRoot) => ({
  residencies: state.data.residencies,
  progress: state.forms.residencyDetails.progress,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators(
    {
      createResidency: Actions.createResidency,
      updateResidency: Actions.updateResidency,
      deleteResidency: Actions.deleteResidency,
      clearProgress: () => (d: Dispatch) =>
        d(Actions.clearResidencyDetailsProgress()),
    },
    dispatch
  );

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps>,
    NavigationScreenProps {}

let ResidencyDetailsScreen = ({
  createResidency,
  updateResidency,
  deleteResidency,
  clearProgress,
  residencies,
  progress,
  navigation,
}: Props) => {
  const residency = navigation.state.params.residency as Residency;
  const form = navigation.state.params.form as string;

  const currentDate = ShortDate.createCurrent();
  const preCurrentDate = currentDate.getAdjacentDate(-RESIDENCY_MIN_LENGTH);

  let id: string;
  let initialResidencyCity: City | null;
  let initialFromDate: ShortDate;
  let initialToDate: ShortDate;

  if (form === 'addResidency') {
    initialResidencyCity = null;
    initialToDate = currentDate;
    initialFromDate = preCurrentDate;
  } else if (form === 'editResidency') {
    id = residency.getID();
    initialResidencyCity = residency.getCity();
    initialFromDate = residency.getFromDate();
    initialToDate = residency.getToDate();
  }

  const [residencyCity, setResidencyCity] = useState(initialResidencyCity);
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [toDate, setToDate] = useState<ShortDate | null>(initialToDate);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const [inputsHaveChanged, setInputsHaveChanged] = useState(false);
  const firstCall = useRef(true);

  const inconsistency = findInconsistency(residencies, {
    id,
    city: residencyCity,
    fromDate,
    toDate,
  });

  // Derived State
  const isCurrent = toDate === null;
  const allInputsExist = !!residencyCity && !!fromDate;
  const minToDate = fromDate.getAdjacentDate(RESIDENCY_MIN_LENGTH);
  const areInputsConsistent = inconsistency === null;

  let saveResidencyDisabled =
    !allInputsExist || !areInputsConsistent || progress.status === 'REQUEST';
  let saveResidency: () => void;
  if (form === 'addResidency')
    saveResidency = () =>
      createResidency(
        residencyCity,
        fromDate,
        toDate,
        navigation,
        PROGRESS_HIDE_DURATION
      );
  else if (form === 'editResidency') {
    saveResidencyDisabled = saveResidencyDisabled || !inputsHaveChanged;
    saveResidency = () =>
      updateResidency(
        id,
        residencyCity,
        fromDate,
        toDate,
        navigation,
        PROGRESS_HIDE_DURATION
      );
  }

  useEffect(
    () => () => {
      clearProgress();
    },
    [clearProgress]
  );

  useEffect(() => {
    if (!firstCall.current) {
      setInputsHaveChanged(true);
    } else {
      firstCall.current = false;
    }
    navigation.setParams({ saveResidency });
  }, [residencyCity, fromDate, toDate]);

  useEffect(() => {
    navigation.setParams({ saveResidencyDisabled });
  }, [saveResidencyDisabled]);

  // toDate section scale
  const toDatePickerScale = useRef(new Animated.Value(isCurrent ? 0 : 1));
  useEffect(() => {
    Animated.timing(toDatePickerScale.current, {
      toValue: isCurrent ? 0 : 1,
      duration: SECTION_APPEAR_DURATION,
    }).start();
  }, [isCurrent]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <FormContainer
        progress={{
          message: inconsistency,
          status: inconsistency ? 'ERROR' : null,
        }}
        showErrorsOnly
      >
        <FormContainer progress={progress} style={styles.formContainer}>
          <View>
            <CitySelector
              label='City'
              selected={residencyCity}
              setSelected={(c: City | null) => {
                if (!c) setResidencyCity(null);
                else setResidencyCity(c);
              }}
              placeholderText='City of residency'
            />
            <SwitchView
              label='I currently reside here'
              value={isCurrent}
              onValueChange={newVal => setToDate(newVal ? null : minToDate)}
            />
            <DatePicker
              isVisible={isFromDatePickerOpen}
              label='From'
              date={fromDate}
              maxDate={preCurrentDate}
              setDate={(d: ShortDate) => {
                setFromDate(d);
                if (toDate && toDate.diff(d) < RESIDENCY_MIN_LENGTH) {
                  setToDate(d.getAdjacentDate(RESIDENCY_MIN_LENGTH));
                }
              }}
              onPress={() => {
                if (isToDatePickerOpen) setIsToDatePickerOpen(false);
                setIsFromDatePickerOpen(!isFromDatePickerOpen);
              }}
            />
          </View>
          <DisappearingPicker
            isVisible={!isCurrent}
            duration={SECTION_APPEAR_DURATION}
            scale={toDatePickerScale.current}
            isOpen={isToDatePickerOpen}
            label='To'
            date={toDate}
            minDate={minToDate}
            maxDate={currentDate}
            setDate={setToDate}
            onPress={() => {
              if (isFromDatePickerOpen) setIsFromDatePickerOpen(false);
              setIsToDatePickerOpen(!isToDatePickerOpen);
            }}
          />
        </FormContainer>
      </FormContainer>
      {form === 'editResidency' && (
        <ButtonHighlight
          label='Delete'
          labelColor={RED_COLOR}
          labelSize={16}
          iconName='delete'
          iconColor={RED_COLOR}
          iconSize={22}
          onPress={() => {
            Alert.alert(
              'Delete residency?',
              'Are you sure you want to delete this residency? It will be gone forever.',
              [
                {
                  text: 'Delete',
                  onPress: (): void => {
                    deleteResidency(id, navigation, PROGRESS_HIDE_DURATION);
                  },
                },
                { text: 'Cancel', onPress: (): void => {} },
              ],
              { cancelable: false }
            );
          }}
          style={styles.deleteButton}
          containerStyle={styles.deleteButtonContainer}
        />
      )}
    </ScrollView>
  );
};

function findInconsistency(
  currentResidencies: Residency[],
  candidate: ResidencyCandidate
) {
  let inconsistency: string | null = null;
  try {
    Residency.validateConsistency(currentResidencies, candidate);
  } catch (err) {
    if (err instanceof MultipleCurrentsError) {
      inconsistency = `You may have at most one residency at any given time. Your current residency is ${err.currentResidency
        .getCity()
        .getName()}.`;
    } else if (err instanceof ConflictInPeriodsError) {
      const s1 = `The new residency conflicts with your ${err.conflictResidency
        .getCity()
        .getName()} residency.`;
      const s2 =
        err.conflictPeriod.getLength() === 0
          ? `The conflict date is ${err.conflictPeriod.getFrom()}.`
          : `The conflict period is ${err.conflictPeriod.toString()}.`;
      inconsistency = `${s1} ${s2}`;
    } else {
      inconsistency = 'An uknown residency conflict has ocurred.';
    }
  }
  return inconsistency;
}

ResidencyDetailsScreen = React.memo(
  ResidencyDetailsScreen,
  (prevProps, nextProps) => {
    if (
      prevProps.progress.status === 'SUCCESS' &&
      nextProps.progress.status === null
    ) {
      return true;
    }
    return false;
  }
);

ResidencyDetailsScreen.navigationOptions = ({ navigation }): {} => {
  const title =
    navigation.getParam('form', 'addResidency') === 'addResidency'
      ? 'Add a residency'
      : 'Edit Details';
  const { form } = navigation.state.params;

  return {
    title,
    headerLeft: () => {
      return (
        <ButtonOpacity
          label='Cancel'
          labelColor={BLUE_COLOR}
          labelSize={16}
          onPress={() => navigation.navigate('HomeDrawer')}
          style={styles.button}
        />
      );
    },
    headerRight: <SaveButton form={form} navigation={navigation} />,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResidencyDetailsScreen);

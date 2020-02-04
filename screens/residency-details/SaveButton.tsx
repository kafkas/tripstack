import React, { ReactElement } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import ButtonOpacity from '../../components/Button/Opacity';
import { BLUE_COLOR } from '../../styles/colors';
import styles from './styles';

interface Props {
  navigation: NavigationScreenProp<{}, {}>;
}

const SaveButton = ({ navigation }: Props): ReactElement => {
  const saveResidency = navigation.getParam('saveResidency', () => {});
  const saveResidencyDisabled = navigation.getParam(
    'saveResidencyDisabled',
    true
  );
  return (
    <ButtonOpacity
      label='Save'
      labelColor={BLUE_COLOR}
      labelSize={16}
      onPress={() => saveResidency()}
      disabled={saveResidencyDisabled}
      style={styles.button}
    />
  );
};

export default React.memo(SaveButton);

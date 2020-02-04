import { StyleSheet } from 'react-native';
import { W_WIDTH, MAX_MARGIN_Y } from '../../styles';
import { BORDER_COLOR, INACTIVE_TEXT_COLOR } from '../../styles/colors';

export const PROGRESS_HIDE_DURATION = 250;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  formContainer: {},
  button: {
    paddingHorizontal: 0,
  },
  disabledErrorContainer: {
    width: W_WIDTH,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_COLOR.toString(),
  },
  errorText: {
    color: INACTIVE_TEXT_COLOR.toString(),
  },
  deleteButtonContainer: {
    alignSelf: 'center',
    marginTop: MAX_MARGIN_Y,
    width: W_WIDTH,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_COLOR.toString(),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_COLOR.toString(),
  },
  deleteButton: {
    minHeight: 40,
  },
});

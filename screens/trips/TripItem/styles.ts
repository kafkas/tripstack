import { StyleSheet } from 'react-native';
import { MIN_MARGIN_Y, W_WIDTH, W_MARGIN, PADDING_Y } from '../../../styles';
import { INACTIVE_TEXT_COLOR } from '../../../styles/colors';

export default StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {},
  title: {
    fontWeight: '500',
  },
  dayCount: {
    position: 'absolute',
    top: PADDING_Y,
    right: W_MARGIN,
    fontSize: 13,
    fontWeight: '600',
    color: INACTIVE_TEXT_COLOR.toString(),
  },
  flags: {
    marginTop: MIN_MARGIN_Y,
    flexDirection: 'row',
    overflow: 'hidden',
    maxWidth: W_WIDTH - 2 * W_MARGIN,
  },
  flag: {},
  cityNames: {
    marginTop: MIN_MARGIN_Y,
  },
  baseCityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: MIN_MARGIN_Y,
  },
  baseCityName: {
    fontWeight: '300',
  },
});

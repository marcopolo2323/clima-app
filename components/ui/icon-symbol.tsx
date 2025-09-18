// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'location.fill': 'location-on',
  'arrow.clockwise': 'refresh',
  'exclamationmark.triangle': 'warning',
  'cloud.sun.fill': 'wb-sunny',
  'info.circle.fill': 'info',
  'calendar': 'calendar-today',
  'map.fill': 'map',
  'sun.max': 'wb-sunny',
  'cloud.fill': 'cloud',
  'humidity.fill': 'water-drop',
  'wind': 'air',
  'thermometer': 'thermostat',
  'eye.fill': 'visibility',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
  'cloud.rain.fill': 'cloud-queue',
  'cloud.snow.fill': 'ac-unit',
  'cloud.bolt.fill': 'flash-on',
  'cloud.fog.fill': 'foggy',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

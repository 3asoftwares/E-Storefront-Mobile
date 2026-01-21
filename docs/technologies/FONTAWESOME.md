# FontAwesome

## Overview

**Version:** 7.1  
**Website:** [https://fontawesome.com](https://fontawesome.com)  
**Category:** Icon Library

FontAwesome provides scalable vector icons for React Native applications.

---

## Installation

```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.5.1",
    "@fortawesome/free-solid-svg-icons": "^6.5.1",
    "@fortawesome/react-native-fontawesome": "^0.3.0",
    "react-native-svg": "^14.1.0"
  }
}
```

---

## Usage

### Basic Usage

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShoppingCart, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <View style={styles.header}>
      <FontAwesomeIcon icon={faSearch} size={20} color="#333" />
      <FontAwesomeIcon icon={faHeart} size={20} color="#ef4444" />
      <FontAwesomeIcon icon={faShoppingCart} size={20} color="#3b82f6" />
    </View>
  );
}
```

### Tab Bar Icons

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

<Tabs.Screen
  name="home"
  options={{
    tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faHome} color={color} size={size} />,
  }}
/>;
```

### With Styling

```tsx
<FontAwesomeIcon
  icon={faStar}
  size={16}
  color={filled ? '#fbbf24' : '#d1d5db'}
  style={styles.starIcon}
/>
```

---

## Common Icons

| Icon             | Usage             |
| ---------------- | ----------------- |
| `faShoppingCart` | Cart              |
| `faHeart`        | Wishlist          |
| `faSearch`       | Search            |
| `faUser`         | Profile           |
| `faHome`         | Home              |
| `faList`         | Categories        |
| `faStar`         | Ratings           |
| `faPlus/faMinus` | Quantity          |
| `faTrash`        | Delete            |
| `faChevronRight` | Navigation arrows |

---

## Related Documentation

- [React Native](REACT_NATIVE.md) - React Native basics
- [Styling](STYLING.md) - Styling patterns

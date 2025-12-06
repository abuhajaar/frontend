# Custom Space Type Icons Integration

## Overview
Custom SVG icons from floor plan designs (lantai1v2.svg, lantai3.svg) have been integrated into the Spaces management page to visually distinguish different workspace types.

## Icon Components Created

### File: `/src/component/icons/SpaceTypeIcons.js`

Three icon components were extracted from your floor plan SVGs:

1. **HotDeskIcon** - Represents hot desks and fixed desks
   - Extracted from `id="HotDesk"` in lantai1v2.svg
   - Features: Desk surface, monitor, keyboard, green status indicator
   - Used for: `hot_desk` and `fixed_desk` types

2. **MeetingRoomIcon** - Represents meeting rooms
   - Extracted from `id="meetingRoom01"` in lantai1v2.svg
   - Features: Conference table, chairs, monitor/presentation screen
   - Used for: `meeting_room` type

3. **PrivateRoomIcon** - Represents private offices
   - Extracted from `id="privateRoom01"` in lantai1v2.svg
   - Features: Room outline, door, laptop/desk, green status indicator
   - Used for: `private_office` type

## Implementation Details

### Icon Mapping Logic
In `/src/app/dashboard/admin/spaces/page.js`, the `getSpaceIcon()` function maps space types to icons:

```javascript
const getSpaceIcon = (type) => {
  switch (type) {
    case 'hot_desk':
    case 'fixed_desk':
      return HotDeskIcon;
    case 'meeting_room':
      return MeetingRoomIcon;
    case 'private_office':
      return PrivateRoomIcon;
    default:
      return HotDeskIcon; // Fallback
  }
};
```

### Dynamic Icon Rendering
Each space row dynamically renders the appropriate icon:

```javascript
const SpaceIcon = getSpaceIcon(space.type);
return (
  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
    <SpaceIcon size={16} className="text-[#717182]" />
  </div>
);
```

## SVG Sources

### Original SVG IDs Found:
- `id="HotDesk"` - Exact match ✅
- `id="meetingRoom01"` through `id="meetingRoom08"` - Lowercase 'm'
- `id="privateRoom01"` through `id="privateRoom08"` - Lowercase 'p' and 'R'

**Note:** Your SVG files use lowercase variants (`meetingRoom`, `privateRoom`) rather than the capitalized versions you initially mentioned (`MeetingRoom`, `PrivateRoom`). The icons were successfully extracted from these lowercase variants.

## Icon Properties

All icon components accept these props:
- `size` - Width/height in pixels (default: 16)
- `className` - Additional CSS classes (applied to SVG element)

The icons use `currentColor` for stroke/fill, allowing them to inherit the text color (#717182) from the parent container.

## Visual Result

Each workspace type now displays a unique icon in the table:
- **Hot Desk / Fixed Desk**: Desk with monitor and keyboard
- **Meeting Room**: Conference table with presentation screen
- **Private Office**: Room with door and laptop/desk

All icons maintain consistent sizing (16px), styling (#717182 color), and positioning within the 32px gray rounded container.

## Files Modified

1. **Created**: `/src/component/icons/SpaceTypeIcons.js` - Icon components
2. **Modified**: `/src/app/dashboard/admin/spaces/page.js`
   - Removed: `MapPin` from lucide-react imports
   - Added: Import of custom icon components
   - Added: `getSpaceIcon()` helper function
   - Updated: Table row rendering to use dynamic icons

## Notes

- Icons are scalable SVG components, maintaining quality at any size
- Fallback to HotDeskIcon for unknown space types
- Icons extracted from floor 1-3 SVG files (lantai = floor in Indonesian)
- All icons include green status indicators matching your floor plan design

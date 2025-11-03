/**
 * Space utility functions
 * Helpers for space data transformation and filtering
 */

import { SPACE_TYPES } from '@/constants/booking';
import { getOrdinalSuffix } from './date';

/**
 * Get space type configuration by API value
 * @param {string} apiType - Type from API (hot_desk, private_room, meeting_room)
 * @returns {Object} Space type configuration
 */
export const getSpaceTypeConfig = (apiType) => {
  const typeMap = {
    hot_desk: SPACE_TYPES.HOT_DESK,
    private_room: SPACE_TYPES.PRIVATE_ROOM,
    meeting_room: SPACE_TYPES.MEETING_ROOM,
  };
  
  return typeMap[apiType] || SPACE_TYPES.DEFAULT;
};

/**
 * Extract floor number from location string
 * @param {string} location - Location string from API (e.g., "Lantai 12")
 * @returns {string|null} Formatted floor (e.g., "12th") or null
 */
export const extractFloorFromLocation = (location) => {
  if (!location) return null;
  
  const floorMatch = location.match(/\d+/);
  if (!floorMatch) return location;
  
  const floorNum = floorMatch[0];
  return `${floorNum}${getOrdinalSuffix(floorNum)}`;
};

/**
 * Get unique floors from spaces array, sorted numerically
 * @param {Array} spaces - Array of space objects
 * @returns {Array} Sorted array of unique floor strings
 */
export const getUniqueFloors = (spaces) => {
  const floors = spaces
    .map(space => space.floor)
    .filter(Boolean);
  
  const uniqueFloors = [...new Set(floors)];
  
  return uniqueFloors.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0);
    return numA - numB;
  });
};

/**
 * Transform API space data to UI format
 * @param {Object} space - Raw space object from API
 * @returns {Object} Transformed space object
 */
export const transformSpaceData = (space) => {
  const typeConfig = getSpaceTypeConfig(space.type);
  const floor = extractFloorFromLocation(space.location);
  
  // Get opening hours for Monday as default
  const today = 'mon';
  const hours = space.opening_hours?.[today];
  const time = hours ? `${hours.start}-${hours.end}` : '08:00-18:00';
  
  // Map amenities to just names array
  const amenities = space.amenities?.map(a => a.name) || [];
  
  return {
    id: space.id,
    name: space.name,
    type: typeConfig.displayName,
    typeColor: typeConfig.color,
    bgColor: typeConfig.bgColor,
    icon: typeConfig.icon,
    capacity: space.capacity,
    badgeColor: typeConfig.badgeColor,
    badgeTextColor: typeConfig.badgeTextColor,
    time,
    amenities,
    buttonColor: typeConfig.buttonColor,
    borderColor: typeConfig.borderColor,
    floor,
    location: space.location,
    status: space.status,
  };
};

/**
 * Filter spaces by floor and type
 * @param {Array} spaces - Array of space objects
 * @param {string} selectedFloor - Selected floor filter
 * @param {string} selectedType - Selected type filter
 * @returns {Array} Filtered spaces
 */
export const filterSpaces = (spaces, selectedFloor, selectedType) => {
  return spaces.filter(space => {
    const floorMatch = selectedFloor === 'all' || space.floor === selectedFloor;
    
    const typeMatch = selectedType === 'all' || 
      (selectedType === 'hot-desk' && space.type === 'Hot Desk') ||
      (selectedType === 'private' && space.type === 'Private Room') ||
      (selectedType === 'meeting' && space.type === 'Meeting Room');
    
    return floorMatch && typeMatch;
  });
};

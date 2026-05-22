import { mockRooms } from '../mockData/roomMockData';

export const fetchRooms = async () => {
  return Promise.resolve({ items: mockRooms });
};

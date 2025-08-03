import { FilmsResponse } from '../types/film';
import { mockFilmsData } from '../data/mockFilms';

const API_BASE_URL = 'https://swapi.dev/api';

export const fetchFilms = async (): Promise<FilmsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/films`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FilmsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching films from API, using mock data:', error);
    // Return mock data as fallback
    return mockFilmsData;
  }
};


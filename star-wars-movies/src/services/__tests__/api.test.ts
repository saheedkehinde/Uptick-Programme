import { fetchFilms } from '../api';
import { mockFilmsData } from '../../data/mockFilms';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchFilms returns data when API call is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockFilmsData),
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await fetchFilms();
    
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/films');
    expect(result).toEqual(mockFilmsData);
  });

  test('fetchFilms returns mock data when API call fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const mockResponse = {
      ok: false,
      status: 500,
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await fetchFilms();
    
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/films');
    expect(result).toEqual(mockFilmsData);
    
    consoleSpy.mockRestore();
  });

  test('fetchFilms returns mock data when network error occurs', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    const result = await fetchFilms();
    
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/films');
    expect(result).toEqual(mockFilmsData);
    
    consoleSpy.mockRestore();
  });

  test('fetchFilms logs error when API call fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    await fetchFilms();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching films from API, using mock data:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  test('fetchFilms handles JSON parsing errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const mockResponse = {
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
    };
    
    (fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await fetchFilms();
    
    expect(result).toEqual(mockFilmsData);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching films from API, using mock data:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });
});


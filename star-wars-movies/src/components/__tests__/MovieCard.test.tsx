import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../MovieCard';
import { Film } from '../../types/film';

const mockFilm: Film = {
  title: "A New Hope",
  episode_id: 4,
  opening_crawl: "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  release_date: "1977-05-25",
  characters: ["https://swapi.dev/api/people/1/"],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  created: "2014-12-10T14:23:31.880000Z",
  edited: "2014-12-20T19:49:45.256000Z",
  url: "https://swapi.dev/api/films/1/"
};

describe('MovieCard Component', () => {
  const mockOnMoreInfo = jest.fn();

  beforeEach(() => {
    mockOnMoreInfo.mockClear();
  });

  test('renders movie information correctly', () => {
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    expect(screen.getByText('A New Hope')).toBeInTheDocument();
    expect(screen.getByText('Ep. 4')).toBeInTheDocument();
    expect(screen.getByText(/1977/)).toBeInTheDocument(); // Just check for the year
    expect(screen.getByText(/It is a period of civil war/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /more information about a new hope/i })).toBeInTheDocument();
  });

  test('truncates long opening crawl text', () => {
    const longCrawlFilm: Film = {
      ...mockFilm,
      opening_crawl: "This is a very long opening crawl that should be truncated because it exceeds the maximum length limit that we have set for the movie card display to ensure proper layout and readability."
    };
    
    render(<MovieCard film={longCrawlFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const crawlText = screen.getByText(/This is a very long opening crawl/);
    expect(crawlText.textContent).toMatch(/\.\.\.$/);
  });

  test('handles More Info button click', async () => {
    const user = userEvent.setup();
    
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const moreInfoButton = screen.getByRole('button', { name: /more information about a new hope/i });
    await user.click(moreInfoButton);
    
    expect(mockOnMoreInfo).toHaveBeenCalledWith(mockFilm);
  });

  test('handles card click', async () => {
    const user = userEvent.setup();
    
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const movieCard = screen.getByRole('article');
    await user.click(movieCard);
    
    expect(mockOnMoreInfo).toHaveBeenCalledWith(mockFilm);
  });

  test('handles keyboard navigation for More Info button', () => {
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const moreInfoButton = screen.getByRole('button', { name: /more information about a new hope/i });
    
    fireEvent.keyDown(moreInfoButton, { key: 'Enter' });
    expect(mockOnMoreInfo).toHaveBeenCalledWith(mockFilm);
    
    fireEvent.keyDown(moreInfoButton, { key: ' ' });
    expect(mockOnMoreInfo).toHaveBeenCalledTimes(2);
  });

  test('handles keyboard navigation for card', () => {
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const movieCard = screen.getByRole('article');
    
    fireEvent.keyDown(movieCard, { key: 'Enter' });
    expect(mockOnMoreInfo).toHaveBeenCalledWith(mockFilm);
    
    fireEvent.keyDown(movieCard, { key: ' ' });
    expect(mockOnMoreInfo).toHaveBeenCalledTimes(2);
  });

  test('displays character count', () => {
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    expect(screen.getByText('1 characters')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<MovieCard film={mockFilm} onMoreInfo={mockOnMoreInfo} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', 'movie-title-4');
    expect(article).toHaveAttribute('aria-describedby', 'movie-description-4');
    expect(article).toHaveAttribute('tabIndex', '0');
    
    const title = screen.getByText('A New Hope');
    expect(title).toHaveAttribute('id', 'movie-title-4');
    
    const description = screen.getByText(/It is a period of civil war/);
    expect(description).toHaveAttribute('id', 'movie-description-4');
  });
});


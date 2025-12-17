import React, { Component } from 'react';
import './App.css';
import Searchbar from './components/Searchbar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Button from './components/Button/Button';
import Loader from './components/Loader/Loader';
import Modal from './components/Modal/Modal';

const apiKeying = '50977795-feb18de71b048a02e0c824e54';
const perPageing = 100;

class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    error: null,
    showModal: false,
    largeImageURL: null,
    totalHits: 0,
  };

  componentDidUpdate(_, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ images: [], page: 1 }, () => {
        this.fetchImages();
      });
    }
  }

  fetchImages = () => {
    const { query, page } = this.state;
    if (!query) return;

    this.setState({ isLoading: true, error: null });

    const url = `https://pixabay.com/api/?q=${encodeURIComponent(
      query
    )}&page=${page}&key=${apiKeying}&image_type=photo&orientation=horizontal&per_page=${perPageing}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка завантаження зображень');
        }
        return response.json();
      })
      .then(data => {
        this.setState(prev => ({
          images: [...prev.images, ...data.hits],
          totalHits: data.totalHits,
        }));
      })
      .catch(error => this.setState({ error: error.message }))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleSearchSubmit = query => {
    if (query === this.state.query) return;
    this.setState({ query });
  };

  handleLoadMore = () => {
    this.setState(
      prev => ({ page: prev.page + 1 }),
      () => this.fetchImages()
    );
  };

  openModal = largeImageURL => {
    this.setState({ showModal: true, largeImageURL });
  };

  closeModal = () => {
    this.setState({ showModal: false, largeImageURL: null });
  };

  render() {
    const { images, isLoading, showModal, largeImageURL, totalHits } = this.state;

    const showLoadMore = images.length > 0 && images.length < totalHits;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery images={images} onImageClick={this.openModal} />
        {isLoading && <Loader />}
        {showLoadMore && (
          <Button onClick={this.handleLoadMore}>Більше зображень</Button>
        )}
        {showModal && (
          <Modal
            onClose={this.closeModal}
            largeImageURL={largeImageURL}
          />
        )}
      </div>
    );
  }
}

export default App;

import { Component } from 'react';

import { fetchProducts } from './api/productsApi';
import ErrorButton from './components/ErrorButton';
import Header from './components/Header';
import Results from './components/Results';
import Search from './components/Search';
import type { Product } from './types/product';

interface AppState {
  products: Product[];
  searchTerm: string;
  lastSearchedTerm: string;
  isLoading: boolean;
  error: string;
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    products: [],
    searchTerm: '',
    lastSearchedTerm: '',
    isLoading: false,
    error: '',
  };

  componentDidMount(): void {
    const savedSearchTerm = localStorage.getItem('searchTerm') ?? '';

    this.setState(
      {
        searchTerm: savedSearchTerm,
        lastSearchedTerm: savedSearchTerm,
      },
      () => {
        void this.loadProducts(savedSearchTerm);
      }
    );
  }

  loadProducts = async (searchTerm: string): Promise<void> => {
    this.setState({ isLoading: true, error: '' });

    try {
      const data = await fetchProducts(searchTerm);

      this.setState({
        products: data.products,
      });
    } catch {
      this.setState({
        products: [],
        error:
          'Unable to load products. Please check your connection or try again later.',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchChange = (value: string): void => {
    this.setState({ searchTerm: value });
  };

  handleSearchSubmit = (): void => {
    const trimmedSearchTerm = this.state.searchTerm.trim();

    if (trimmedSearchTerm === this.state.lastSearchedTerm) {
      return;
    }

    localStorage.setItem('searchTerm', trimmedSearchTerm);

    this.setState(
      {
        searchTerm: trimmedSearchTerm,
        lastSearchedTerm: trimmedSearchTerm,
      },
      () => {
        void this.loadProducts(trimmedSearchTerm);
      }
    );
  };

  render() {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <Header />

          <Search
            searchTerm={this.state.searchTerm}
            isLoading={this.state.isLoading}
            onChange={this.handleSearchChange}
            onSearch={this.handleSearchSubmit}
          />

          <Results
            products={this.state.products}
            isLoading={this.state.isLoading}
            error={this.state.error}
          />

          <div className="mt-6 flex justify-end">
            <ErrorButton />
          </div>
        </div>
      </main>
    );
  }
}

export default App;

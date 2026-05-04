import { Component, type KeyboardEvent } from 'react';

interface SearchProps {
  searchTerm: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

class Search extends Component<SearchProps> {
  handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      this.props.onSearch();
    }
  };

  render() {
    const { searchTerm, isLoading, onChange, onSearch } = this.props;

    return (
      <section className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Search</h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-900"
            type="text"
            value={searchTerm}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={this.handleKeyDown}
            placeholder="Search products..."
          />

          <button
            className="rounded-lg bg-slate-900 px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            type="button"
            onClick={onSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </section>
    );
  }
}

export default Search;

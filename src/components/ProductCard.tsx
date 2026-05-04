import { Component } from 'react';

import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

class ProductCard extends Component<ProductCardProps> {
  render() {
    const { product } = this.props;

    return (
      <article className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[220px_1fr]">
        <h3 className="font-semibold text-slate-900">{product.title}</h3>
        <p className="leading-6 text-slate-600">{product.description}</p>
      </article>
    );
  }
}

export default ProductCard;

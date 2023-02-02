// Write your code here

import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const statusOptions = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsData: [],
    quantity: 1,
    status: statusOptions.initial,
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({status: statusOptions.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({
        productDetails: updatedData,
        status: statusOptions.success,
        similarProductsData: data.similar_products,
      })
    } else {
      this.setState({status: statusOptions.failure})
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrementQuantity = () => {
    this.setState(prevState => {
      if (prevState.quantity === 1) {
        this.setState({quantity: prevState.quantity})
      } else {
        this.setState({quantity: prevState.quantity - 1})
      }
    })
  }

  renderProductDetails = () => {
    const {productDetails, quantity, similarProductsData} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="product-rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="label-value-container">
              <p className="label">Available:</p>
              <p className="value">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <hr />
            <div className="quantity-container">
              <button
                type="button"
                data-testid="minus"
                className="quantity-controller-button"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                data-testid="plus"
                className="quantity-controller-button"
                onClick={this.onIncrementQuantity}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              productDetails={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#3b82f6" height={80} width={80} />
    </div>
  )

  renderProductDetailsStatus = () => {
    const {status} = this.state
    switch (status) {
      case statusOptions.failure:
        return this.renderFailure()

      case statusOptions.inProgress:
        return this.renderLoader()

      case statusOptions.success:
        return this.renderProductDetails()

      default:
        return null
    }
  }

  onClickShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailure = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        onClick={this.onClickShopping}
        className="continue-shopping-button"
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductDetailsStatus()}</div>
      </>
    )
  }
}

export default ProductItemDetails

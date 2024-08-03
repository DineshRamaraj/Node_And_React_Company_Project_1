import {Link} from 'react-router-dom'
import './index.css'

const Failure = props => {
  const {onRetry} = props
  const onClickRetry = () => {
    onRetry()
  }
  return (
      <div className="main-failure-container">
        <div className="failure-container">
          <img
            src="https://res.cloudinary.com/dhwz560kk/image/upload/v1712342164/w1vd87na63ca2t9sargo.png"
            alt="failure view"
            className="failure-img"
          />
          <h1 className="failure-heading">Oops! Something Went Wrong</h1>
          <p className="failure-description">We are having some trouble</p>
          <Link to="/">
            <button
              type="button"
              className="failure-button"
              onClick={onClickRetry}
            >
              Retry
            </button>
          </Link>
        </div>
      </div>
  )
}

export default Failure
import  { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { Loader } from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';
import Paging from '../components/Pagination';
import SearchBox from '../components/SearchBox';
import { Link } from 'react-router-dom';

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });

  return (
    <>
    { isLoading ? (
      <Loader/>
    ) : error ? (
      <Message variant='danger'>{error?.data?.message || error.error}</Message>
    ) : 
    (
      <>
        <Row>
          <Col>
            <h1>Latest Product</h1>
          </Col>
          <Col>
            <SearchBox />
          </Col>
          { keyword && ( 
            <Col md={2}>
              <Link to='/' className='btn btn-light'>
                Go Back
              </Link>
            </Col>
            )}
        </Row>
        <Row>
            {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <ProductCard product={product}/>
                </Col>
            ))}
        </Row>
        <Paging 
          pages={data.pages}
          page={data.page}
          keyword={keyword ? keyword : ''}
        />
      </>
     )}
    </>
  )
}

export default Home
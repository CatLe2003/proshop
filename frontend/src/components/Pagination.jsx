import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";

const Paging = ({ pages, page, isAdmin = false }) => {
  const { userInfo } = useSelector((state) => state.auth);
  isAdmin = userInfo.isAdmin;
  
  return (
    pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
            <Pagination>
                { [...Array(pages).keys()].map((x) => (
                    <LinkContainer
                    key={x + 1}
                    to= {
                        !isAdmin 
                        ? `/page/${x + 1}`
                        : `/admin/product-list/${x + 1}`
                    }
                    >
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                    </LinkContainer> 
                ))}
            </Pagination>
        </div>
    )
  )
}

export default Paging
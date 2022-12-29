import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from "./config";

const sizes = ["S", "M", "L"];

const ProductList = () => {
  const [show, setShow] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [getCategoryList, setCategoryList] = useState([]);
  const [getAllBrand, setAllBrand] = useState([]);
  const [getSubCategoryList, setSubCategory] = useState([]);
  const [getAllProduct, setProductList] = useState([]);
  const [productName, setProductName] = useState("");
  const [getCategryId, setCategoryId] = useState("");
  const [subcategoryName, setSubCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [getColor, setSelectColor] = useState("");
  const [size, setSize] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [Discount, setDiscount] = useState("");
  const [sellingPrice, setSellingPrice] = useState();
  const [productId, setProductId] = useState("");

  //--------------CLOSE AND OPEN MODAL FOR ADD PRODUCT  FUNCTION---------------------\\
  const handleClose = () => {
    setShow(false);
    setSize([]);
    AllProducts();
  };
  const handleShow = () => setShow(true);

  //---------------HANDLE  CHECK THE SIZE  FUNCTION---------------\\
  
  const handleSize = (item) => {

    if (item.target.checked) {
      setSize([...size, item.target.value]);
    } else {
      setSize(size.filter((_item) => _item !== item.target.value));
    }
    
  };

  //-------------ONCHANGE CATEGORY FIND ID OF CATEGORY--------------\\

  let Selectcategory = (e) => {
    setCategoryId(e.target.value);
  };

  //------------Get All Category List Api 👇👇👇👇----------------\\
  const CotegoryList = async () => {
    try {
      let categoryres = await axios.get(baseUrl +
        "/api/getAllcategory"
      );
      setCategoryList(categoryres.data?.getAll);
      // console.log(categoryres,"categoryres");
    } catch (error) {
      console.log("error", error);
    }
  };

  //-------------GET ALL SUB-CATEGORY BY ID API 👇👇👇👇-----------------\\

  useEffect(() => {
    if (getCategryId) {
      axios
        .get(baseUrl +
          `/api/getProductBySubCategory/${getCategryId}`
        )
        .then((res) => {
          setSubCategory(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getCategryId]);

  //-------------GET ALL BRAND API CALL 👇👇👇👇--------------------\\

  const allBrands = async () => {
    try {
      let brandres = await axios.get(baseUrl +"/api/getAllbrand");
      // console.log(brandres,"brandres==>");
      setAllBrand(brandres.data?.getAll);
    } catch (error) {}
  };

  //--------------All Product List api ---------------------\\

  let AllProducts = async () => {
    try {
      let allproducts = await axios.get(baseUrl +
        "/api/getAlladdProduct"
      );
      setProductList(allproducts.data?.getAll);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    CotegoryList();
    allBrands();
    AllProducts();
  }, []);

  //------------UPDATE PRODUCT HANDLER FUNCTION------------------------\\

  const openModal = (id) => {
    setIsOpen(true);
    setProductId(id);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //------------Delete Product Api 👇👇👇👇👇-------------------\\
  const deleteProduct = async (id) => {
    try {
      let res = await axios.delete(baseUrl +
        `/api/deleteproduct/${id}`
      );
      AllProducts();
      toast.success(res.data?.message, { autoClose: 600 });
    } catch (error) {
      console.log(error, "delete error");
    }
  };

  // console.log("size", size);

  //-------------GET PRODUCT BY ID DETAILS API 👇👇👇👇------------------\\
  const getProductById = async () => {
    // setSize([]);
    await axios
      .get(baseUrl +`/api/getOneProduct/${productId}`)
      .then((response) => {
        let item = response.data?.getOne;
        setProductName(item.productName);
        setCategoryId(item.productCategory?._id);
        setSubCategoryName(item.productSubCategory?._id);
        setBrandName(item.brand?._id);
        item.color.map((_item) => setSelectColor(_item.colorName));
        let arr = [];
        item.color?.map((_item) => {
          _item.size.map((_size) => {
            arr.push(_size);
            setSize(arr);
          });
        });
        setQuantity(item.quantity);
        setPrice(item.productPrice);
        setDiscount(item.productDiscount);
        setSellingPrice(item.sellingPrice);
      });
  };
  useEffect(() => {
    getProductById();
  }, [productId]);

  //------------UPDATE API CALL👇👇👇👇 HERE---------------------\\
  const UpdateProduct = async () => {
    let updateData = {
      productName: productName,
      productPrice: price,
      productDiscount: Discount,
      productCategory: getCategryId,
      productSubCategory: subcategoryName,
      brand: brandName,
      quantity: quantity,
      color: [
        {
          colorName: getColor,
          size: size,
        },
      ],

      sellingPrice: sellingPrice,
    };
    // console.log(getColor);

    try {
      let res = await axios.put(baseUrl +
        `/api/updateproduct/${productId}`,
        updateData
      );
      closeModal();
      toast.success(res.data?.message,{autoClose:"600"})
      // console.log("update res====>", res);
      AllProducts();
    } catch (error) {
      console.log("Error update", error);
    }
  };

  //  console.log(size,"size=====>>>>>")

  //--------------ADD NEW PRODUCT API ------------------------\\

  const AddProduct = async () => {
    // console.log(productName,getCategryId,subcategoryName,brandName,getColor,size,quantity,price,Discount,"=======>");
    let productDetails = {
      productName: productName,
      productPrice: price,
      productDiscount: Discount,
      productCategory: getCategryId,
      productSubCategory: subcategoryName,
      brand: brandName,
      quantity: quantity,
      color: [
        {
          colorName: getColor,
          size: size,
        },
      ],

      sellingPrice: sellingPrice,
    };
    try {
      let AddProduct = await axios.post(baseUrl +
        "/api/addProduct",
        productDetails
      );
      console.log("AddProduct", AddProduct);
      setSize([]);
      AllProducts();
      toast.success(AddProduct.data?.message, { autoClose: 600 });
    } catch (error) {
      console.log(error, "error==>");
    }
    setTimeout(() => {
      handleClose();
    }, 2000);
    AllProducts();
  };

  return (
    <>
      <Container>
        <Row>
          <h1 className="text-center text-warning mt-3">Crud Operation</h1>
          <Col md={8} className="mx-auto">
            <Button className="me-auto" onClick={handleShow}>
              Add New Product
            </Button>
            <Table responsive="md" className="mt-3">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Sub category</th>
                  <th>Brand</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getAllProduct !== "" &&
                  getAllProduct.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{(index = index + 1)}</td>
                          <td>{item.productName}</td>
                          <td>{item.productCategory?.categoryName}</td>
                          <td>{item.productSubCategory?.subCategoryName}</td>
                          <td>{item.brand?.brandName}</td>
                          <td>{item.color.map((item) => item.colorName)}</td>
                          <td>{item.color.map((_item) => _item.size.map((_size,_index)=>(
                            <>
                            {
                              _index === _item.size.length - 1 ?
                              <text>{_size}</text>
                              :
                              <text>{_size},</text>
                            }
                            </>
                          )))}</td>

                          <td>
                            <AiFillEdit onClick={() => openModal(item._id)} />
                            &nbsp; &nbsp;
                            <MdDelete
                              onClick={(e) => {
                                deleteProduct(item._id);
                              }}
                            />
                            <ToastContainer />
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {/*---------------- Add New Product modal---------------------------*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Product Name
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Product Name"
                onChange={(e) => setProductName(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Category
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={Selectcategory}
              >
                <option selected disabled>
                  Open this select Category
                </option>
                {getCategoryList !== "" &&
                  getCategoryList.map((item, index) => {
                    return (
                      <>
                  
                        <option value={item._id} key={index}>
                          {item.categoryName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Sub-category
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSubCategoryName(e.target.value)}
              >
                <option selected disabled>
                  Open this select Sub-Category
                </option>
                {getSubCategoryList !== "" &&
                  getSubCategoryList.map((item, index) => {
                    return (
                      <>
                        {" "}
                        <option value={item._id} key={index}>
                          {item.subCategoryName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Brand
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setBrandName(e.target.value)}
              >
                <option selected disabled>
                  Open this select Brand
                </option>
                {getAllBrand !== "" &&
                  getAllBrand.map((item, index) => {
                    return (
                      <>
                        {" "}
                        <option value={item._id} key={index}>
                          {item.brandName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Varient
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSelectColor(e.target.value)}
              >
                <option>Choose Color</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
              </Form.Select>
            </Col>
          </Form.Group>
          {getColor && (
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Size
              </Form.Label>
              <Col
                sm="8"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Form.Check
                  type="checkbox"
                  className="Checks"
                  value="L"
                  label="L"
                  onClick={(item) => handleSize(item)}
                />
                <Form.Check
                  type="checkbox"
                  className="Checks"
                  value="S"
                  label="S"
                  onClick={(item) => handleSize(item)}
                />
                <Form.Check
                  type="checkbox"
                  className="Checks"
                  value="M"
                  label="M"
                  onClick={(item) => handleSize(item)}
                />
              </Col>
            </Form.Group>
          )}

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Quantity
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Product Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Product Price
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Product Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Discount
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Discount"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Selling Price
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Product Price"
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={AddProduct}>
            Save
          </Button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>
      {/*---------------- Add New Product modal End---------------------------*/}

      {/*----------------UPDATE Product modal UI 👇👇👇👇---------------------------*/}

      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>UPDATE Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Product Name
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Product Name"
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Category
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={Selectcategory}
                value={getCategryId}
              >
                <option selected disabled>
                  Open this select Category
                </option>
                {getCategoryList !== "" &&
                  getCategoryList.map((item, index) => {
                    return (
                      <>
                        <option value={item._id} key={index}>
                          {item.categoryName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Sub-category
            </Form.Label>
            <Col sm="8">
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setSubCategoryName(e.target.value)}
                value={subcategoryName}
              >
                <option selected disabled>
                  Open this select Sub-Category
                </option>
                {getSubCategoryList !== "" &&
                  getSubCategoryList.map((item, index) => {
                    return (
                      <>
                        <option value={item._id} key={index}>
                          {item.subCategoryName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Brand
            </Form.Label>
            <Col sm="8">
              <Form.Select
                value={brandName}
                aria-label="Default select example"
                onChange={(e) => setBrandName(e.target.value)}
              >
                <option selected disabled>
                  Open this select Brand
                </option>
                {getAllBrand !== "" &&
                  getAllBrand.map((item, index) => {
                    return (
                      <>
                        <option value={item._id} key={index}>
                          {item.brandName}
                        </option>
                      </>
                    );
                  })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Varient
            </Form.Label>
            <Col sm="8">
              <Form.Select
                value={getColor}
                aria-label="Default select example"
                onChange={(e) => setSelectColor(e.target.value)}
              >
                <option>Choose Color</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
              </Form.Select>
            </Col>
          </Form.Group>
          {getColor && (
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Size
              </Form.Label>
              <Col
                sm="8"
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {sizes.map((item) => {
                  return size.includes(item) ? (
                    <>
                      <Form.Check
                        type="checkbox"
                        className="Checks"
                        value={item}
                        label={item}
                        onClick={(item) => handleSize(item)}
                        checked={size}
                      />
                    </>
                  ) : (
                    <>
                      <Form.Check
                        type="checkbox"
                        className="Checks"
                        value={item}
                        label={item}
                        onClick={(item) => handleSize(item)}
                      />
                    </>
                  );
                })}
              </Col>
            </Form.Group>
          )}

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Quantity
            </Form.Label>
            <Col sm="8">
              <Form.Control
                value={quantity}
                type="text"
                placeholder="Product Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Product Price
            </Form.Label>
            <Col sm="8">
              <Form.Control
                value={price}
                type="text"
                placeholder="Product Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Discount
            </Form.Label>
            <Col sm="8">
              <Form.Control
                value={Discount}
                type="text"
                placeholder="Discount"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Selling Price
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                value={sellingPrice}
                placeholder="Product Price"
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={UpdateProduct}>
            UPDATE
          </Button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>

      {/*----------------UPDATE Product modal UI  END 👆👆👆👆👆---------------------------*/}
    </>
  );
};

export default ProductList;

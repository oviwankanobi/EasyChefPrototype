import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import EditProfileHeader from "../../components/EditProfile/EditProfileHeader";
import EditProfileForm from "../../components/ShoppingCart/ShoppingCartList";
import ShoppingCartList from "../../components/ShoppingCart/ShoppingCartList";
import ShoppingCartRecipes from "../../components/ShoppingCart/ShoppingCartRecipes";
import { axios } from "../../utils/axiosAutoAuth";

function ShoppingListPage() {
  var [shoppingCart, setShoppingCart] = useState([]);
  var [totals, setTotals] = useState({});
  var [removeErrors, setRemoveErrors] = useState([]);
  var [loginError, setLoginError] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/recipes/cart-details/")
      .then((response) => {
        setShoppingCart(response.data.splice(0, response.data.length - 1));
        setTotals(response.data[0].Totals);
        setLoginError(false);
      })
      .catch((error) => {
        if (error.request.status === 401) {
          setLoginError(true);
        } else {
          setLoginError(false);
        }
      });
  }, [removeErrors]);

  return (
    <>
      <div className="container">
        <EditProfileHeader text="Recipes Cart" />
        <ShoppingCartRecipes
          cart={shoppingCart}
          setRemoveErrors={setRemoveErrors}
        />
        {loginError && (
          <Alert variant="danger">
            Please check if you are logged in, then try again.
          </Alert>
        )}
        <EditProfileHeader text="Ingredient Totals" />
        <ShoppingCartList totals={totals} />
      </div>
    </>
  );
}

export default ShoppingListPage;

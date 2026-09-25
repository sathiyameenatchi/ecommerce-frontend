import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {

    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get("/products");

            console.log("PRODUCTS =", response.data);

            setProducts(response.data);
        } catch (error) {
            console.error("LOAD ERROR =", error);
        }
    };

    const handleSearch = () => {
        console.log("SEARCH BUTTON CLICKED");
        console.log("SEARCH TEXT =", searchText);
    };

    const filteredProducts = products.filter((product) => {

        const productName = String(product.name || "").toLowerCase();
        const keyword = searchText.trim().toLowerCase();

        return productName.includes(keyword);
    });

    return (
        <div className="container">

            <h1>Products</h1>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search product..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />

                <button
                    type="button"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

            

            <div className="products">

                {filteredProducts.length === 0 ? (

                    <p>No products found</p>

                ) : (

                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))

                )}

            </div>

        </div>
    );
}

export default Products;
import React from "react";
import { useState, useEffect, useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { GetAllProduk } from "../../../../api/apiProduk";
import { GetAllHampers } from "../../../../api/apiHampers";
import { MdCancel } from "react-icons/md";
import { getImageHampers, getImageProduk } from "../../../../api";
import ProdukAllSkeleton from "./ProdukAllSkeleton";
import ProdukCategory from "./ProdukCategory";
import ProdukAll from "./ProdukAll";
import HampersAll from "./HampersAll";
import { GlobalStateContext } from "../../../../api/contextAPI";
import "./text.css";

const ShowAllProduk = () => {
  const imagePlaceHolder =
    "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg";
  const { cart, setCart } = useContext(GlobalStateContext);
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      //ngecek
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        //nimpa
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = newItem;
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        //buat baru
        const updatedCart = [...prevCart, newItem];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
    });
  };

  const [produk, setProduk] = useState([]);
  const [hampers, setHampers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    query: "",
    category: "",
  });
  const [listCategory, setListCategory] = useState([]);
  const handleChange = (event) => {
    setSearchQuery({ ...searchQuery, [event.target.name]: event.target.value });
  };
  const fetchProduk = () => {
    setIsLoading(true);
    GetAllProduk()
      .then((res) => {
        setProduk(res);
        const categories = [];

        fetchHampers()
          .then((hampersData) => {
            res.forEach((item) => {
              if (
                !categories.some(
                  (category) =>
                    category.jenis.toLowerCase() === item.jenis.toLowerCase()
                )
              ) {
                categories.push({
                  jenis: item.jenis,
                  image: item.image,
                });
              }
            });

            // update listCategory
            if (
              hampersData.length > 0 &&
              !categories.some((category) => category.jenis === "Hampers")
            ) {
              setListCategory([
                ...categories,
                {
                  jenis: "Hampers",
                  image: hampersData[0].image,
                },
              ]);
            } else {
              setListCategory(categories);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchHampers = () => {
    return GetAllHampers()
      .then((res) => {
        setHampers(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <Container className="py-3">
      <Stack gap={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-search">
            Cari Produk
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-search"
            placeholder="Cari Produk"
            name="query"
            disabled={isLoading}
            endAdornment={
              <InputAdornment position="end">
                {!(typeof searchQuery.query === "string"
                  ? searchQuery.query.trim() === ""
                  : searchQuery.query === "") && (
                  <IconButton
                    onClick={() =>
                      setSearchQuery({ ...searchQuery, query: "" })
                    }
                    edge="end"
                  >
                    <MdCancel />
                  </IconButton>
                )}
              </InputAdornment>
            }
            label="Cari Produk"
            autoComplete="off"
            value={searchQuery.query}
            onChange={handleChange}
          />
        </FormControl>
        {searchQuery.category.trim() !== "" && (
          <FormControl fullWidth>
            <InputLabel id="label-category">Kategori</InputLabel>
            <Select
              labelId="label-category"
              label="Kategori"
              name="category"
              value={searchQuery.category}
              onChange={handleChange}
            >
              {listCategory.map((category, index) => (
                <MenuItem key={index} value={category.jenis}>
                  {category.jenis}
                </MenuItem>
              ))}
              <MenuItem value="All">Semua</MenuItem>
            </Select>
          </FormControl>
        )}
      </Stack>

      {!isLoading ? (
        searchQuery.query !== "" ? (
          <>
            <ProdukAll
              produk={produk}
              searchQuery={searchQuery}
              imagePlaceHolder={imagePlaceHolder}
              addToCart={addToCart}
            />

            <HampersAll
              hampers={hampers}
              searchQuery={searchQuery}
              imagePlaceHolder={imagePlaceHolder}
              addToCart={addToCart}
            />
          </>
        ) : searchQuery.category !== "" ? (
          searchQuery.category === "All" || searchQuery.query !== "" ? (
            <>
              <ProdukAll
                produk={produk}
                searchQuery={searchQuery}
                imagePlaceHolder={imagePlaceHolder}
                addToCart={addToCart}
              />

              <HampersAll
                hampers={hampers}
                searchQuery={searchQuery}
                imagePlaceHolder={imagePlaceHolder}
                addToCart={addToCart}
              />
            </>
          ) : searchQuery.category === "Hampers" ? (
            <HampersAll
              hampers={hampers}
              searchQuery={searchQuery}
              imagePlaceHolder={imagePlaceHolder}
              addToCart={addToCart}
            />
          ) : (
            <ProdukAll
              produk={produk}
              searchQuery={searchQuery}
              imagePlaceHolder={imagePlaceHolder}
              addToCart={addToCart}
            />
          )
        ) : (
          <ProdukCategory
            listCategory={listCategory}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            imagePlaceHolder={imagePlaceHolder}
            getImageHampers={getImageHampers}
            getImageProduk={getImageProduk}
          />
        )
      ) : (
        <ProdukAllSkeleton />
      )}
    </Container>
  );
};

export default ShowAllProduk;

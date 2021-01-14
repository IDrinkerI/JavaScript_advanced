const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Keyboard', price: 200 },
    { id: 3, title: 'Mouse', price: 100 },
    { id: 4, title: 'Gamepad', price: 87 },

    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Keyboard', price: 200 },
    { id: 3, title: 'Mouse', price: 100 },
    { id: 4, title: 'Gamepad', price: 87 },
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Keyboard', price: 200 },
    { id: 3, title: 'Mouse', price: 100 },
    { id: 4, title: 'Gamepad', price: 87 },
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Keyboard', price: 200 },
    { id: 3, title: 'Mouse', price: 100 },
    { id: 4, title: 'Gamepad', price: 87 },
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Keyboard', price: 200 },
    { id: 3, title: 'Mouse', price: 100 },
    { id: 4, title: 'Gamepad', price: 87 },
];

const renderProduct = (product) => {
    if (product === undefined || product.title === undefined || product.price === undefined) { return ""; }

    return `<div class="product_item">
                <h3 class="product_item-title">${product.title}</h3>
                <p class="product_item-price">price: ${product.price} у.е.</p>
                <button class="product_item-button">Add to cart</button>
            </div>`;
}

const render = (productList = []) => {
    if (!Array.isArray(productList)) { throw new Error("product list is not array"); }

    let elements = productList.map(item => renderProduct(item));
    document.querySelector(".products").innerHTML = elements.join("");
}

render(products);
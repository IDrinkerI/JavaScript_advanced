const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/";


class TryGetResult {
    constructor(result = false, object = null) {
        this.result = result;
        this.object = object;
    }
}

class Cart {
    constructor(containerSelector) {
        this._items = [];
        this._container = document.querySelector(containerSelector);
    }

    add(product) {
        let { result: isFound } = this.tryGetCartItem(product.id);

        if (isFound) {
            this.incrementItemCount(product.id);
        }
        else {
            let newItem = new CartItem(product);
            newItem.onCnahgeCount = updateCartHandler;
            this._items.push(newItem);
        }
    }

    remove(product) {
        let { object: cartItem, result: isFound } = this.tryGetCartItem(product.id);

        if (isFound) {
            cartItem.setCount(0);
        }
    }

    clear() {
        this._items = [];
    }

    tryGetCartItem(id) {
        for (const item of this._items) {
            if (item.id === id) {
                return new TryGetResult(true, item);
            }
        }
        return new TryGetResult();
    }

    render() {
        this._container.innerHTML = "";

        for (const item of this._items) {
            this._container.insertAdjacentHTML("beforeend", item.render());
        }
    }

    // _getTotalPrice() {   //  Возвращает суммарную стоимость товаров в козине
    // }                    //

    update() {
        this._items = this._items.filter(item => item.getCount() > 0);

        this.render();
    }

    incrementItemCount(id) {
        let { object: cartItem, result: isFound } = this.tryGetCartItem(id);

        if (isFound) {
            cartItem.incrementCount();
        }
    }

    decrementItemCount(id) {
        let { object: cartItem, result: isFound } = this.tryGetCartItem(id);

        if (isFound) {
            cartItem.decrementCount();
        }
    }
}

class CartItem {
    constructor(product) {
        let { title, price, id } = product;
        this.title = title;
        this.price = price;
        this.id = id;
        this._count = 1;
    }

    getCount() {
        return this._count;
    }

    setCount(count) {
        if (typeof (count) != "number" || count < 0) { return; }

        this._count = count;
        this.onCnahgeCount();
    }

    incrementCount() {
        this._count++;
        this.onCnahgeCount();
    }

    decrementCount() {
        if (this._count <= 0) { return; }

        this._count--;
        this.onCnahgeCount();
    }

    getTotalPrice() {
        return this._count * this.price;
    }

    onCnahgeCount() { }

    render() {
        return `<div id="${this.id}">
                    <span>${this.title}</span>
                    <span>$${this.price}</span>
                    <button onclick="decrementButtonHandler(event)">-</button>
                    <span>${this._count}</span>
                    <button onclick="incrementButtonHandler(event)">+</button>
                    <span>$${this.getTotalPrice()}</span>
                </div>`;
    }
}

class Product {
    constructor(title = "", price = 0, id = 0, image = ImageRepo.gag) {
        this.title = title;
        this.price = price;
        this.id = id;
        this.image = image;
    }

    render() {
        return `<div class="product_item">
                    <img src="${this.image}" alt="${this.title}">
                    <h3 class="product_item-title">${this.title}</h3>
                    <p class="product_item-price">price: $${this.price}</p>
                    <button class="product_item-button">Add to cart</button>
                </div>`;
    }
}

class ProductList {
    constructor(containerSelector = ".products") {
        this._products = [];
        this._container = document.querySelector(containerSelector);
    }

    render() {
        this._container.innerHTML = "";

        for (const product of this._products) {
            this._container.insertAdjacentHTML("beforeend", product.render());
        }
    }

    add(product) {
        this._products.push(product);
    }

    addProducts(products, shouldClear = true) {
        if (Array.isArray(products)) {
            if (shouldClear) {
                this.clear();
            }

            for (const product of products) {
                this.add(product);
            }
        }
        else {
            throw new Error("ProductList.addProducts(products, shouldClear) invalid argument exception, products is not array.");
        }
        return this;
    }

    clear() {
        this._products = [];
    }

    getTotalPrice() {
        let totalPrice = 0;
        for (const product of this._products) {
            totalPrice += product.price;
        }
        return totalPrice;
    }
}

class ImageRepo {
    static gag = "https://placehold.it/100x50";

    static getImage(productTitle) {
        return this.gag;
    }
}

class ProductRepo {
    static GetProductsAllAsync() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .then(json => this._mapperFromGBAsync(json));
    }

    static async _mapperFromGBAsync(origin) {
        return this._mapperFromGB(origin);
    }

    static _mapperFromGB(origin) {
        let result = [];
        for (const originItem of origin) {
            let { id_product, product_name, price } = originItem;
            result.push(new Product(product_name, price, id_product));
        }

        return result;
    }
}

function incrementButtonHandler(event) {
    let id = parseInt(event.target.parentNode.id);
    cart.incrementItemCount(id);
}

function decrementButtonHandler(event) {
    let id = parseInt(event.target.parentNode.id);
    cart.decrementItemCount(id);
}

function updateCartHandler() {
    cart.update();
}

const productList = new ProductList(".products");
ProductRepo.GetProductsAllAsync().then(products => productList.addProducts(products).render());

const cart = new Cart(".cartTest");
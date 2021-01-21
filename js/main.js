const API = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/";


class TryGetResult {
    constructor(result = false, object = null) {
        this.result = result;
        this.object = object;
    }
}

class HTMLIdPrefix {
    constructor(prefix = "") {
        this.idPrefix = prefix;
    }

    gethtmlId(id = 0) {
        return `${this.idPrefix}${id}`;
    }

    getIdByhtmlId(htmlId) {
        return parseInt(htmlId.slice(this.idPrefix.length));
    }
}

class Cart {
    constructor(containerSelector, infoWrapperSelector) {
        this._items = [];
        this._container = document.querySelector(containerSelector);
        this._container.classList.add("cart");

        this._infoWrapper = document.querySelector(infoWrapperSelector);
        this._infoWrapper.append(this._createOpenCartButton());

        this.render();
    }

    changeVisibility() {
        if (this._container.style.visibility === "visible") {
            this._container.style.visibility = "hidden";
        }
        else {
            this._container.style.visibility = "visible";
        }
    }

    add(product) {
        let { result: isFound, object: cartItem } = this.tryGetCartItem(product.id);

        if (isFound) {
            cartItem.incrementCount();
        }
        else {
            let newItem = new CartItem(product);
            newItem.onCnahgeCount = ShopBehavior.updateCartHandler;
            this._items.push(newItem);
        }

        this.update();
    }

    remove(productId) {
        let { object: cartItem, result: isFound } = this.tryGetCartItem(productId);

        if (isFound) {
            cartItem.setCount(0);
        }

        this.update();
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

        let title = `<p class="cart-title">Cart:</p>`;
        this._container.insertAdjacentHTML("beforeend", title);

        for (const item of this._items) {
            this._container.insertAdjacentHTML("beforeend", item.render());
        }

        let totalPriceInfo = `<p class="cart-total_price">Goods count: ${this.getTotalCount()}. Total price: $${this.getTotalPrice()}</p>`;
        this._container.insertAdjacentHTML("beforeend", totalPriceInfo);
    }

    getTotalCount() {
        let totalCount = 0;

        for (const item of this._items) {
            totalCount += item.getCount();
        }

        return totalCount
    }

    getTotalPrice() {
        let totalPrice = 0;

        for (const item of this._items) {
            totalPrice += item.getTotalPrice();
        }
        return totalPrice;
    }

    update() {
        this._items = this._items.filter(item => item.getCount() > 0);

        this.render();
    }

    incrementItemCount(htmlId) {
        let cartItemId = CartItem.getIdByhtmlId(htmlId);
        let { object: cartItem, result: isFound } = this.tryGetCartItem(cartItemId);

        if (isFound) {
            cartItem.incrementCount();
        }
    }

    decrementItemCount(htmlId) {
        let cartItemId = CartItem.getIdByhtmlId(htmlId);
        let { object: cartItem, result: isFound } = this.tryGetCartItem(cartItemId);

        if (isFound) {
            cartItem.decrementCount();
        }
    }

    _createOpenCartButton() {
        let btn = document.createElement("button");
        btn.classList.add("cart-open_btn");
        btn.innerText = "Cart";
        btn.onclick = ShopBehavior.cartOpenBtnHandler;
        return btn;
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

    static _idPrefix = new HTMLIdPrefix("cart_item_");

    static getIdByhtmlId = (htmlId) => this._idPrefix.getIdByhtmlId(htmlId);

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
        return `<div class="cart_item" id="${CartItem._idPrefix.gethtmlId(this.id)}">
                    <span class="cart_item-title">${this.title}</span>
                    <span class="cart_item-price">Price: $${this.price}</span>
                    <button class="cart_item-button" onclick="ShopBehavior.decrementButtonHandler(event)">-</button>
                    <span class="cart_item-count">${this._count}</span>
                    <button class="cart_item-button" onclick="ShopBehavior.incrementButtonHandler(event)">+</button>
                    <span class="cart_item-total_price">Total: $${this.getTotalPrice()}</span>
                    <button class="cart_item-button" onclick="ShopBehavior.deleteCartItemBtnHadnler(event)">x</button>
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

    static _idPrefix = new HTMLIdPrefix("product_");

    static getIdByhtmlId = (htmlId) => this._idPrefix.getIdByhtmlId(htmlId);

    render() {
        return `<div class="product_item" id="${Product._idPrefix.gethtmlId(this.id)}">
                    <img src="${this.image}" alt="${this.title}">
                    <h3 class="product_item-title">${this.title}</h3>
                    <p class="product_item-price">price: $${this.price}</p>
                    <button class="product_item-button" onclick="ShopBehavior.addProductButtonHandler(event)">Add to cart</button>
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
    static getProductsAllAsync() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .then(json => this._mapperFromGBAsync(json));
    }

    static async getProductByIdAsync(id = 0) {
        return ProductRepo.getProductsAllAsync().then(products => products.find((product) => product.id === id));
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

class ShopBehavior {
    static _isSetup = false;

    static setup() {
        ShopBehavior.productList = new ProductList(".products");
        ShopBehavior.cart = new Cart(".cart_container", ".header_cart_info-wrapper");

        ShopBehavior._isSetup = true;
        return ShopBehavior;
    }

    static run() {
        if (ShopBehavior._isSetup) {
            ProductRepo.getProductsAllAsync().then(products => ShopBehavior.productList.addProducts(products).render());
            ShopBehavior.cart.render();
        }
        else {
            throw new Error("ShopBehavior need setup before run");
        }
    }

    static incrementButtonHandler(event) {
        ShopBehavior.cart.incrementItemCount(event.target.parentNode.id);
    }

    static decrementButtonHandler(event) {
        ShopBehavior.cart.decrementItemCount(event.target.parentNode.id);
    }

    static deleteCartItemBtnHadnler(event) {
        let productId = CartItem.getIdByhtmlId(event.target.parentNode.id);
        ShopBehavior.cart.remove(productId);
    }

    static addProductButtonHandler(event) {
        let productId = Product.getIdByhtmlId(event.target.parentNode.id);
        ProductRepo.getProductByIdAsync(productId).then(product => ShopBehavior.cart.add(product));
    }

    static cartOpenBtnHandler() {
        ShopBehavior.cart.changeVisibility();
    }

    static updateCartHandler() {
        ShopBehavior.cart.update();
    }
}
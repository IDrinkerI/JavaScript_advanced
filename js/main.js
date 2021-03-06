class Cart {
    constructor(containerSelector) {
        // this._items;     //  Массив для хранения товаров(экземпляров CartItem) в корзине
        //this._container;  //  HTML контейнер для отображаения корзины 
    }

    // add(product) {       //  Добавляет товар в корзину
    // }                    //

    // remove(product) {    //  Удаляет товар из корзины
    // }                    //

    // clear() {            //  Очищает корзину
    // }                    //

    // contains(product) {  //  Проверяет наличие товара в корзине
    // }                    //  необходим управление кол-вом товара одного вида в корзине

    // render() {           //  Заполняет _container HTML кодом
    // }                    //

    // _getTotalPrice() {   //  Возвращает суммарную стоимость товаров в козине
    // }                    //
}

class CartItem {
    constructor(product) {
        // this.title;          // Наименование товара
        // this.price;          // Цена товара
        // this.id;             // ID товара
        // this.count;          // Кол-во товаров в корзине
    }

    // render() {              // Метод получения HTML кода представляющего экземпляр класса CartItem
    // }                       //
}

class Product {
    constructor(product, image = ImageRepo.gag) {
        let { title, price, id } = product;
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
        this._products.push(new Product(product, ImageRepo.getImage(product.title)));
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
    static GetProductsAll() {
        return [
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
    }
}


const productList = new ProductList(".products");
productList.addProducts(ProductRepo.GetProductsAll()).render();

console.log(`ProductList total price: ${productList.getTotalPrice()}`);
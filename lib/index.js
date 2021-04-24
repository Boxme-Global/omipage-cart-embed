"use strict";
class Item {
    constructor(sku, name, price, discounted_price, image, quantity) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.discounted_price = price;
        this.image = image;
        this.quantity = quantity;
    }
    total_amount() {
        return self.quantity * self.price;
    }
    increase_quantity(quantity = 1) {
        this.quantity += quantity;
    }
}
class Cart {
    constructor() {
        this.items = [];
        this.load_cart_from_storage();
    }

    add_item_to_cart(item) {

        var stored_item = this.find(item.sku)
        if (!stored_item) {
            this.items.push(item);
            this.save_cart();
            return
        }
        var index_of_stored_item = this.items.indexOf(stored_item);

        stored_item.increase_quantity(item.quantity);
        this.items[index_of_stored_item] = stored_item;
        this.save_cart();
    }
    find(sku) {
        return this.items.find((value) => {
            return value.sku == sku;
        })
    }
    total_quantity(){
        var total = 0;
        this.items.forEach((value, index) => {
            total += value.quantity;
        })
        
        return total;
        
    }
    has(sku) {
        return this.find(sku) != null;
    }

    clear_cart() {
        this.items = [];
        this.save_cart();
    }

    save_cart() {
        window.localStorage.setItem('omp_cart', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('cart_changed', {
            bubbles: true
        }, { "detail": "Event change cart" }));
    }

    load_cart_from_storage() {
        this.items = [];

        var _stored_cart_items = JSON.parse(
            window.localStorage.getItem('omp_cart')
        );

        if (_stored_cart_items) {
            for (var _stored_item in _stored_cart_items) {
                var item = new Item(
                    _stored_cart_items[_stored_item]['sku'],
                    _stored_cart_items[_stored_item]['name'],
                    Number(_stored_cart_items[_stored_item]['price']),
                    Number(_stored_cart_items[_stored_item]['discounted_price']),
                    _stored_cart_items[_stored_item]['image'],
                    Number(_stored_cart_items[_stored_item]['quantity']),
                );
                this.items.push(item);
            }
        }

    }

}
cart = new Cart()

document.addEventListener('cart_changed', (e) => {
    cart_quantity_els = document.querySelectorAll('[data-cart-quantity="true"]');
    if (cart_quantity_els.length > 0){
        cart_quantity_els[0].innerHTML = cart.total_quantity();
    }
})

add_to_cart_btns = document.querySelectorAll('[data-action="add_to_cart"]');
var add_to_cart_handler = function (ev) {
    var el = this;
    var product_name, sku, quantity, price, discounted_price, image, append_to_cart;

    product_name = el.getAttribute('data-name');
    sku = el.getAttribute('data-sku');
    quantity = Number(el.getAttribute('data-quantity'));
    price = Number(el.getAttribute('data-price'));
    discounted_price = Number(el.getAttribute('data-discounted-price'));
    image = el.getAttribute('data-image');
    append_to_cart = el.getAttribute('data-append-to-cart');

    item = new Item(sku, product_name, price, discounted_price, image, quantity);
    cart.add_item_to_cart(item);
}

var i;
for (i = 0; i < add_to_cart_btns.length; i++) {
    add_to_cart_btns[i].addEventListener('click', add_to_cart_handler);
}
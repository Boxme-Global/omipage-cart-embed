"use strict";
(function (window){


class Omipage {
    constructor(cart) {
        this.cart = cart
        this.cart_quantity_els = document.querySelectorAll('[data-cart-quantity="true"]');
        this.add_to_cart_btns = document.querySelectorAll('[data-action="add_to_cart"]');
        this.checkout_btns = document.querySelectorAll('[data-action="checkout"]');
        this.store_page_key()
        this.store_page_title()
    }
    display_quantity_to_view(){
        this.cart_quantity_els.forEach((el) => {
            el.innerHTML = self.cart.total_quantity();
        })
    }
    binding_cart_quantity() {
        var self = this
        self.display_quantity_to_view(); // default binding

        // bind value when cart changed
        document.addEventListener('cart_changed', (e) => {
            self.display_quantity_to_view();
        })
    }
    binding_add_to_cart_button() {

        var add_to_cart_handler = function (ev) {
            var el = this;
            var product_name, sku, quantity, price, discounted_price, image, append_to_cart;
            var is_checkout = el.getAttribute('data-action') == 'checkout'
            var is_add_to_cart = el.getAttribute('data-action') == 'add_to_cart';
            product_name = el.getAttribute('data-name');
            sku = el.getAttribute('data-sku');
            quantity = Number(el.getAttribute('data-quantity'));
            price = Number(el.getAttribute('data-price'));
            discounted_price = Number(el.getAttribute('data-discounted-price'));
            image = el.getAttribute('data-image');
            append_to_cart = el.getAttribute('data-append-to-cart');
            console.log('clicked', is_checkout)
            if (is_checkout && append_to_cart == 'false') {
                cart.clear_cart()
            }

            if (product_name && sku && quantity && price && discounted_price) {
                var item = new Item(sku, product_name, price, discounted_price, image, quantity);
                cart.add_item_to_cart(item);
            }

            if (is_checkout) {
                window.location = '/checkout?cart=' + window.localStorage.getItem('omp_cart_id')
            }
        }

        this.add_to_cart_btns.forEach((el) => {
            el.addEventListener('click', add_to_cart_handler);
        })

        this.checkout_btns.forEach((el) => {
            el.addEventListener('click', add_to_cart_handler);
        })

    }
    get_meta(meta_name) {
        const metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('name') === meta_name) {
                return metas[i].getAttribute('content');
            }
        }

        return '';
    }

    store_page_key() {
        localStorage.setItem('omp_key', this.get_meta('omp_key'))
    }

    store_page_title() {
        localStorage.setItem('omp_title', document.title)
    }
}

class Item {
    constructor(sku, name, price, discounted_price, image, quantity) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.discounted_price = discounted_price;
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

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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
    total_quantity() {
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
        this.omp_cart_id = window.localStorage.getItem('omp_cart_id')
        if (!this.omp_cart_id) {
            this.omp_cart_id = this.uuidv4();
            window.localStorage.setItem('omp_cart_id', this.omp_cart_id);
        }
    }

}

window.Cart = Cart;
window.Omipage = Omipage
})(window)

var cart = new Cart();
var omipage = new Omipage(cart);
omipage.binding_add_to_cart_button()
omipage.binding_cart_quantity()


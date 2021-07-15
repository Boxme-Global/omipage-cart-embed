"use strict";
(function (window) {
    class Omipage {
        constructor(cart) {
            this.cart = cart
            this.cart_quantity_els = document.querySelectorAll('[data-cart-quantity="true"]');
            this.add_to_cart_btns = document.querySelectorAll('[data-action="add_to_cart"]');
            this.checkout_btns = document.querySelectorAll('[data-action="checkout"]');
            this.select_els = document.querySelectorAll('select');
            this.load_page_key()
            this.load_page_title()
            this.load_utm_tag()
            this.load_referral()
            this.render_popup_style()
            this.create_popup_elements()
            this.render_popup()
        }

        create_popup_elements() {
            var popup = document.createElement('DIV');
            popup.setAttribute("id", "omp-cart-popup");
            document.body.appendChild(popup)
        }

        open_cart_popup() {
            this.render_popup()
            var popup_el = document.getElementById('omp-cart-popup');
            popup_el.setAttribute("class", "active");
        }

        close_cart_popup() {
            var popup_el = document.getElementById('omp-cart-popup');
            popup_el.classList.remove("active");

        }

        render_popup_style() {
            var styles = `#omp-cart-popup {
                            font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
                            display: none; /* Hidden by default */
                            position: fixed; /* Stay in place */
                            z-index: 10000; /* Sit on top */
                            left: 0;
                            top: 0;
                            width: 100%; /* Full width */
                            height: 100%; /* Full height */
                            background-color: rgb(0,0,0); /* Fallback color */
                            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */ 
                        }
                        
                        #omp-cart-popup * {
                            box-sizing: border-box !important;
                        }
                        
                        #omp-cart-popup.active {
                            display:block;
                        }
                        
                        .omp-cart-title {
                            font-size: 22px;
                        }
                        
                        .omp-cart-popup-content {
                            position: relative;
                            background-color: #fefefe;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #888;
                            width: 100%;
                            max-width: 1000px;
                            height: 100%;
                        }
                        
                        .omp-cart-row {
                            display: block;
                            margin: 5px 0px;
                            border-bottom: 1px solid #f2f2f2;
                            padding-bottom: 10px;
                        }
                        
                        .omp-cart-row:last-child {
                            border-bottom: none;
                        }
                        
                        .omp-cart-header {
                            display: flex;
                            justify-content: space-between;
                            align-item: center;
                        }
                        
                        .omp-cart-close {
                            display: flex;
                            align-item: center;
                        }
                        
                        .omp-cart-close button {
                            background: none;
                            border: none;
                            color: #333;
                        }
        
                        .omp-cart-close button:hover {
                            cursor: pointer;
                        }
                        
                        .omp-text-center {
                            text-align: center;
                        }
                        
                        .omp-cart-image {
                            width: 50px!important;
                            height: 50px;
                            float: left;
                        }
                        
                        .omp-cart-image img {
                            width: 50px;
                            height: 50px;
                            border-radius: 3px;
                        }
                        
                        .omp-cart-product-name {
                            font-size: 13px;
                            padding-left:5px;
                            font-weight:400;
                            min-width: 300px;
                        }
                        
                        .omp-cart-quantity-content {
                            display: -webkit-inline-flex;
                            display: inline-flex;
                        }
                        
                        .omp-cart-quantity-content input {
                            width: 50px;
                            height: 30px;
                            text-align: center;
                            border: 1px solid #cdcdcd;
                            border-radius: 0px;    
                        }
                        
                        .omp-cart-quantity-content button {
                            border: 1px solid #cdcdcd;
                            cursor: pointer;
                            text-align: center;
                            width: 21px;
                            height: 30px;
                            background: #cdcdcd;
                            padding: 8px!important;
                            border-radius: 0;
        
                        }
                        .omp-cart-quantity-content button:active {
                            height: 29px;
                        }
        
                        .omp-cart-price{
                            text-align: right;
                            color:red;
                            width: 180px;
                        }
                        .omp-cart-remove-item button{
                            border: 1px solid #cdcdcd;
                            cursor: pointer;
                            text-align: center;
                            width: 23px;
                            height: 30px;
                            margin-left: 5px;
                            font-size:11px;
                            background: #cdcdcd;
                            padding: 8px!important;
        
                        }
                        .omp-cart-remove-item button:active {
                            height: 29px;
                        }
                        
                        .omp-cart-action {
                            position: fixed;
                            bottom: 0;
                            width: 100%;
                            max-width: 1000px;
                            left: 50%;
                            transform: translateX(-50%);
                            padding: 20px 15px;
                            box-shadow: 0 -2px 6px 0 rgb(66 73 83 / 8%);
                        }
                        
                        .omp-cart-action button {
                            height: 45px;
                            background: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 3px;
                            width: 100%;
                            font-size: 18px;
                            cursor: pointer;
                        }
                        
                        .omp-cart-action button:active{
                            opacity: 0.9;
                        }
        
                        .omipage-checkout__products-item {
                            display: grid;
                            grid-template-columns: 5rem auto 10rem 2rem;
                            grid-template-areas:
                                "thumbnail name discounted-price delete-button"
                                "thumbnail quantity quantity delete-button";
                            grid-column-gap: 1rem;
                            grid-row-gap: 0.75rem;
                        }
                    
                        .omipage-checkout__products-item--thumbnail {
                            grid-area: thumbnail;
                            align-self: center;
                            width: 5rem;
                            max-height: 5rem;
                            border-radius: 3px;
                        }
                
                        .omipage-checkout__products-item--name {
                            grid-area: name;
                            align-self: center;
                            white-space: normal;
                            word-break: break-word;
                        }
                        .omipage-checkout__products-item--name .item-name__group--product-name {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            font-weight: 400;
                        }
    
                        .omipage-checkout__products-item--discounted-price {
                            grid-area: discounted-price;
                            align-self: center;
                            white-space: normal;
                            word-break: break-word;
                            color:red;
                            text-align: right;
                        }
                        
                        .omipage-checkout__products-item--delete-button {
                            grid-area: delete-button;
                            align-self: center;
                            color: red;
                            text-align: right
                        }
                
                        .omipage-checkout__products-item--quantity {
                            grid-area: quantity;
                            align-self: center;
                        }
        
                        /* When the browser is at least 600px and above */
                        /* Portrait and Landscape */
                        @media (max-width: 767.98px) { 
                            .omipage-checkout__products-item--thumbnail {
                                width: 3rem;
                            }
                            .omipage-checkout__products-item {
                                grid-template-columns: 3rem auto 10rem 1.5rem;
                            }
                        }`


            var styleSheet = document.createElement("style")
            styleSheet.appendChild(document.createTextNode(styles));
            document.head.appendChild(styleSheet)
        }

        render_popup() {
            var popup_el = document.getElementById('omp-cart-popup');

            if (this.cart.items.length == 0) {
                cart_content = `
                    <div class="omp-cart-popup-content">
                        <p class ="omp-text-center ">
                            <img src="https://storage.googleapis.com/omisell-cloud/omipage/cart_empty.png" width="300px" alt="" class="mx-auto">
                        </p>
                        <p class ="omp-text-center ">
                            Giỏ hàng của bạn trống
                        </p>
                        
                        
                        <div class="omp-cart-action">
                            <button onclick="omipage.close_cart_popup()">Quay lại</button>
                       </div>
                   </div>
                `
                popup_el.innerHTML = cart_content;
                return
            }

            var cart_header = `<div class="omp-cart-popup-content">
                                   <div class="omp-cart-header">
                                       <div class="omp-cart-close" onclick="omipage.close_cart_popup()">
                                           <button>
                                               <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                                   <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                               </svg>
                                           </button>
                                       </div>
                                       <p class ="omp-text-center omp-cart-title">Giỏ hàng</p>
                                       <p class="spacer"></p>
                                   </div>`;

            var cart_footer = `<div class="omp-cart-action">
                                    <a href="/checkout" onMouseOver="this.style.cursor='pointer'"><button data-action="checkout">THANH TOÁN NGAY</button></a>
                               </div>`;

            var cart_content = "";

            this.cart.items.forEach(function (item) {
                var cart_row = `
                    <div  class="omp-cart-row" id="omp-cart-row-` + item.sku + `">
                        <div class="col-12 omipage-checkout__products-item">
                            <img alt="Product image" class="omipage-checkout__products-item--thumbnail"
                                src="` + item.image + `" onerror="this.src='https://storage.googleapis.com/omisell-cloud/omipage/product.png'">
                            <div  class="omipage-checkout__products-item--name">
                                <div  class="item-name__group">
                                    <div  class="item-name__group--product-name" title="` + item.name + `"> ` + item.name + ` </div>
                                </div>
                            </div>
                            <div  class="omipage-checkout__products-item--discounted-price text-danger"> <span id="omp-cart-price-` + item.sku + `">` + (item.discounted_price * item.quantity).toLocaleString() + ` VNĐ</span>
                            </div>
                            <div class="omipage-checkout__products-item--quantity input-group">
                                <div class="omp-cart-quantity-content">
                                    <button onclick="javascript: omipage.decrease_quantity('` + item.sku + `', 1);" type="button"><span>-</span></button>
                                    <input id="omp-cart-quantity-input-` + item.sku + `" type="number" min="1" value="` + item.quantity + `" oninput="javascript: omipage.set_quantity('` + item.sku + `', this.value);">
                                    <button type="button" onclick="javascript: omipage.increase_quantity('` + item.sku + `', 1);"><span>+</span></button>
                                </div>
                            </div>
                            <div class="omipage-checkout__products-item--delete-button text-danger pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </div>
                        </div>
                    </div>`;
                cart_content += cart_row
            })


            popup_el.innerHTML = cart_header + cart_content + '</div>' + cart_footer
        }

        display_quantity_to_view() {
            var self = this
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
            var self = this;

            var add_to_cart_handler = function (ev) {
                var el = this;
                var product_id, product_name, sku, quantity, price, discounted_price, image, is_buy_now, is_clear_cart;
                var is_checkout = el.getAttribute('data-action') === 'checkout'
                var is_add_to_cart = el.getAttribute('data-action') === 'add_to_cart';
                var form = document.getElementById(el.getAttribute('data-form'))

                product_name = el.getAttribute('data-name');
                product_id = el.getAttribute('data-product-id');
                sku = el.getAttribute('data-sku');
                quantity = Number(el.getAttribute('data-quantity'));
                price = Number(el.getAttribute('data-price'));
                discounted_price = Number(el.getAttribute('data-discounted-price'));
                image = el.getAttribute('data-image');
                is_buy_now = el.getAttribute('data-buy-now');
                is_clear_cart = el.getAttribute('data-clear-cart');

                if (!product_id) {
                    return;
                }

                if (is_checkout && form) {
                    var select = form.getElementsByTagName('select')[0];
                    if (select && select.getAttribute('data-selected') === '') {
                        select.setCustomValidity('Please select an item in the list');
                        form.reportValidity();
                        return;
                    }
                }


                if ((is_checkout && is_buy_now == 'true') || is_clear_cart == 'true') {
                    self.cart.clear_cart();
                }

                if (!discounted_price) {
                    discounted_price = price;
                }

                if (product_name && sku && quantity && price && discounted_price) {
                    var item = new Item(product_id, sku, product_name, price, discounted_price, image, quantity);


                    self.cart.add_item_to_cart(item);
                }

                if (is_checkout) {
                    window.location = '/checkout?cart=' + window.localStorage.getItem('omp_cart_id');
                }
            }

            this.add_to_cart_btns.forEach((el) => {
                el.addEventListener('click', add_to_cart_handler);
            })

            this.checkout_btns.forEach((el) => {
                el.addEventListener('click', add_to_cart_handler);
            })

        }

        binding_select_dropdown_event() {
            var self = this;

            var add_to_cart_on_select = function (e) {
                var _el = this;
                self.cart.clear_cart();

                if (!_el.querySelectorAll(`option[value=${_el.getAttribute('data-selected')}]`)
                    || !_el.querySelectorAll(`option[value=${_el.getAttribute('data-selected')}]`).length) {
                    return
                }

                var _option_selected = _el.querySelectorAll(`option[value=${_el.getAttribute('data-selected')}]`)[0]

                var product_name, sku, quantity, price, discounted_price, image;

                product_name = _option_selected.getAttribute('data-name');
                sku = _option_selected.getAttribute('data-sku');
                quantity = Number(_option_selected.getAttribute('data-quantity'));
                price = Number(_option_selected.getAttribute('data-price'));
                discounted_price = Number(_option_selected.getAttribute('data-discounted-price'));
                image = _option_selected.getAttribute('data-image');


                if (!discounted_price) {
                    discounted_price = price
                }

                if (product_name && sku && quantity && price && discounted_price) {
                    var item = new Item(sku, product_name, price, discounted_price, image, quantity);


                    self.cart.add_item_to_cart(item);
                }
            }

            this.select_els.forEach((el) => {
                el.addEventListener('change', add_to_cart_on_select);
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

        load_page_key() {
            localStorage.setItem('omp_key', this.get_meta('omp_key'))
        }

        load_page_title() {
            if (!localStorage.getItem('omp_title')) {
                localStorage.setItem('omp_title', document.title)
            }

        }

        parse_query_string(query) {
            var vars = query.split("&");
            var query_string = {};
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                var key = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1]);
                // If first entry with this name
                if (typeof query_string[key] === "undefined") {
                    query_string[key] = decodeURIComponent(value);
                    // If second entry with this name
                } else if (typeof query_string[key] === "string") {
                    var arr = [query_string[key], decodeURIComponent(value)];
                    query_string[key] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[key].push(decodeURIComponent(value));
                }
            }
            return query_string;

        }

        getLocation(href) {
            var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
            return match && {
                href: href,
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            }
        }

        load_referral() {
            var referral_url = document.referrer;
            if (referral_url) {
                localStorage.setItem('referral_url', referral_url)
                localStorage.setItem('referral_host', this.getLocation(referral_url).hostname)
            }
        }

        load_utm_tag() {
            var exists_utm_tag = {}

            try {
                exists_utm_tag = JSON.parse(localStorage.getItem('utm_tag') || "{}")
            } catch (error) {
                console.log(exists_utm_tag)
            }

            var query = window.location.search.substring(1);
            var qs = this.parse_query_string(query);
            var utm_tags = {}
            if (qs.utm_source) {
                utm_tags['utm_source'] = qs.utm_source
            }
            if (qs.utm_medium) {
                utm_tags['utm_medium'] = qs.utm_medium
            }
            if (qs.utm_campaign) {
                utm_tags['utm_campaign'] = qs.utm_campaign
            }
            if (qs.utm_term) {
                utm_tags['utm_term'] = qs.utm_term
            }
            if (qs.utm_content) {
                utm_tags['utm_content'] = qs.utm_content
            }
            utm_tags = Object.assign(utm_tags, exists_utm_tag)

            localStorage.setItem('utm_tag', JSON.stringify(utm_tags))
        }

        update_cart_view_by_sku(sku) {
            var item = this.cart.find(sku);
            if (item) {
                var quantity_el = document.getElementById("omp-cart-quantity-input-" + sku);
                var price_el = document.getElementById("omp-cart-price-" + sku);
                quantity_el.value = item.quantity
                price_el.innerHTML = (item.quantity * item.discounted_price).toLocaleString() + ' VND'
            } else {
                this.remove_item(sku);
            }
        }

        remove_item(sku) {
            this.cart.remove_item(sku);
            var cart_item = document.getElementById('omp-cart-row-' + sku);
            if (cart_item) {
                cart_item.remove()
            }
            this.render_popup()

        }

        set_quantity(sku, quantity) {
            this.cart.set_quantity(sku, parseInt(quantity));
            this.update_cart_view_by_sku(sku);
        }

        increase_quantity(sku, quantity = 1) {
            this.cart.increase_sku_quantity(sku, quantity);
            this.update_cart_view_by_sku(sku);
        }

        decrease_quantity(sku, quantity = 1) {
            this.cart.decrease_sku_quantity(sku, quantity);
            this.update_cart_view_by_sku(sku);
        }

    }

    class Item {
        constructor(product_id, sku, name, price, discounted_price, image, quantity) {
            this.product_id = product_id;
            this.sku = sku;
            this.name = name;
            this.price = price;
            this.discounted_price = discounted_price;
            this.image = image;
            this.quantity = quantity;
            this.added_time = parseInt(new Date().getTime() / 1000);
        }

        total_amount() {
            return self.quantity * self.price;
        }

        increase_quantity(quantity = 1) {
            this.quantity += quantity;
        }

        set_quantity(quantity) {
            this.quantity = quantity;
        }

        decrease_quantity(quantity = 1) {
            this.quantity -= quantity;
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

        generate_cart_id() {
            this.omp_cart_id = this.uuidv4();
            window.localStorage.setItem('omp_cart_id', this.omp_cart_id);
        }

        remove_item(sku) {
            var stored_item = this.find(sku)
            if (stored_item) {
                var index_of_stored_item = this.items.indexOf(stored_item);
                this.items.splice(index_of_stored_item, 1);
            }
            this.save_cart();
        }

        set_quantity(sku, quantity) {
            var stored_item = this.find(sku)
            if (stored_item) {
                var index_of_stored_item = this.items.indexOf(stored_item);
                var change_type = 'decrease' ? (quantity - stored_item.quantity <= 0) : 'increase'

                if (change_type == 'decrease') {
                    if (window.dataLayer) {
                        window.dataLayer.push({ecommerce: null});
                        window.dataLayer.push({
                            'event': 'addToCart',
                            'ecommerce': {
                                'currencyCode': 'VND',
                                'add': {                                // 'add' actionFieldObject measures.
                                    'products': [{                        //  adding a product to a shopping cart.
                                        'name': stored_item.product_name,
                                        'id': stored_item.sku,
                                        'price': stored_item.discounted_price,
                                        'variant': stored_item.product_name,
                                        'quantity': -(quantity - stored_item.quantity)
                                    }]
                                }
                            }
                        });
                    }
                } else {
                    if (window.dataLayer) {
                        window.dataLayer.push({ecommerce: null});
                        window.dataLayer.push({
                            'event': 'addToCart',
                            'ecommerce': {
                                'currencyCode': 'VND',
                                'add': {                                // 'add' actionFieldObject measures.
                                    'products': [{                        //  adding a product to a shopping cart.
                                        'name': stored_item.product_name,
                                        'id': stored_item.sku,
                                        'price': stored_item.discounted_price,
                                        'variant': stored_item.product_name,
                                        'quantity': quantity - stored_item.quantity
                                    }]
                                }
                            }
                        });
                    }
                }

                stored_item.set_quantity(quantity);
                this.items[index_of_stored_item] = stored_item;
                this.save_cart();
                return;
            }
        }

        increase_sku_quantity(sku, quantity = 1) {
            var stored_item = this.find(sku)
            if (stored_item) {

                if (window.dataLayer) {
                    window.dataLayer.push({ecommerce: null});
                    window.dataLayer.push({
                        'event': 'addToCart',
                        'ecommerce': {
                            'currencyCode': 'VND',
                            'add': {                                // 'add' actionFieldObject measures.
                                'products': [{                        //  adding a product to a shopping cart.
                                    'name': stored_item.product_name,
                                    'id': stored_item.sku,
                                    'price': stored_item.discounted_price,
                                    'variant': stored_item.product_name,
                                    'quantity': stored_item.quantity
                                }]
                            }
                        }
                    });
                }

                var index_of_stored_item = this.items.indexOf(stored_item);
                stored_item.increase_quantity(quantity);
                this.items[index_of_stored_item] = stored_item;
                this.save_cart();
                return;
            }
            console.log('not found item in the cart')
        }

        decrease_sku_quantity(sku, quantity = 1) {
            var stored_item = this.find(sku)
            if (stored_item) {
                if (window.dataLayer) {
                    window.dataLayer.push({ecommerce: null});
                    window.dataLayer.push({
                        'event': 'removeFromCart',
                        'ecommerce': {
                            'currencyCode': 'VND',
                            'add': {                                // 'add' actionFieldObject measures.
                                'products': [{                        //  adding a product to a shopping cart.
                                    'name': stored_item.product_name,
                                    'id': stored_item.sku,
                                    'price': stored_item.discounted_price,
                                    'variant': stored_item.product_name,
                                    'quantity': stored_item.quantity
                                }]
                            }
                        }
                    });
                }
                var index_of_stored_item = this.items.indexOf(stored_item);
                stored_item.decrease_quantity(quantity);

                // Remove item from cart in case quantity is less than or equal 0
                if (stored_item.quantity <= 0) {
                    this.items.splice(index_of_stored_item, 1);

                } else {
                    this.items[index_of_stored_item] = stored_item;
                }

                this.save_cart();
                return;
            }
            console.log('not found item in the cart')
        }

        add_item_to_cart(item) {
            if (window.dataLayer) {
                window.dataLayer.push({ecommerce: null});
                window.dataLayer.push({
                    'event': 'addToCart',
                    'ecommerce': {
                        'currencyCode': 'VND',
                        'add': {                                // 'add' actionFieldObject measures.
                            'products': [{                        //  adding a product to a shopping cart.
                                'name': item.product_name,
                                'id': item.sku,
                                'price': item.discounted_price,
                                'variant': item.product_name,
                                'quantity': item.quantity
                            }]
                        }
                    }
                });
            }

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
            this.generate_cart_id()
            this.items = [];
            this.save_cart();
        }

        save_cart() {
            window.localStorage.setItem('omp_cart', JSON.stringify(this.items));

            const _cartEl = document.getElementsByClassName('cart-item-count');
            Array.from(_cartEl).forEach(el => el.innerHTML = this.items.length.toString());

            document.dispatchEvent(new CustomEvent('cart_changed', {
                bubbles: true
            }, {"detail": "Event change cart"}));
        }

        load_cart_from_storage() {
            this.items = [];

            var _stored_cart_items = JSON.parse(
                window.localStorage.getItem('omp_cart')
            );

            if (_stored_cart_items) {
                for (var _stored_item in _stored_cart_items) {
                    var item = new Item(
                        Number(_stored_cart_items[_stored_item]['product_id']),
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
                this.generate_cart_id()
            }
        }

    }

    window.Cart = Cart;
    window.Omipage = Omipage
})(window)

var cart = new Cart();
var omipage = new Omipage(cart);
omipage.binding_add_to_cart_button();
omipage.binding_cart_quantity();
omipage.binding_select_dropdown_event();

// omipage.cart.clear_cart()
// omipage.cart.add_item_to_cart({
//     'sku': 'xxxx',
//     'name': 'xxxx',
//     'price': 'xxxx',
//     'discounted_price': 'xxxx',
//     'image': 'xxxx',
//     'quantity': 'xxxx',
// });









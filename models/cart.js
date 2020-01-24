module.exports = class Cart {
    constructor(oldCart) {
        this.items = oldCart.items || [];
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
    }

    add(id, size, color, title, image, price) {
        
        for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];
            if (el.id === id && el.size === size) {
                el.qty++
                el.price += price

                this.totalQty++
                this.totalPrice += price 
                return
            }
        }

        let newitem = { id: id, 
            size: size, 
            color: color, 
            title: title, 
            image: image, 
            qty: 1, 
            price: price }
        this.items.push(newitem) 

        this.totalQty++
        this.totalPrice+= price 
    }


    remove(id, size) {
        for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];

            if (el.id === id && el.size === size) {
                this.totalQty -= el.qty
                this.totalPrice -= el.price
                this.items.splice(i, 1)
                return
            }
        } 
    }


    update(id, size, qty) {
        for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];

            if (el.id === id && el.size === size) {
                this.totalQty += (qty - el.qty)
                this.totalPrice -= el.price
                el.price = (el.price / el.qty) * qty
                el.qty = qty
                this.totalPrice += el.price
                return
            }
        } 
    }

}





// const Cart = mongoose.model('Cart', new mongoose.Schema({
//     items: [mongoose.Schema.Types.ObjectId]

// }))
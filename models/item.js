class Item {
    static extract(html) {
        html
        return
    }
    constructor(itemData) {
        this.title = itemData.title;
        this.desc = itemData.desc;
        this.price = itemData.price;
        this.date = itemData.date;
        this.location = itemData.location;
        this.id = itemData.id;
        this.url = itemData.url;
    }

    // constructor(title, desc, price, date, location, url) {
    //     this.title = title;
    //     this.desc = desc;
    //     this.price = price;
    //     this.date = date;
    //     this.location = location;
    //     this.id = id;
    //     this.url = url;
    // }

    
}

module.exports = Item;
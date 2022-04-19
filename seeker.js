// var http = require('http');
const axios = require('axios');
const HTMLParser = require('node-html-parser');
const rxjs = require('rxjs');
const Item = require('./models/item');


class Seeker {
    constructor(url, userId) {
        this.url = url;
        this.latest = null;

        this.userId = userId;


        // Data subject to notify changes
        this.data$ = new rxjs.BehaviorSubject([]);

        // Request latest items
        this.getLatestItems();

        // Start interval schedule
        this.scheduleRef = this.activateSchedule();

        console.log("Now seeking on " + this.url);
    }


    activateSchedule() {
        console.log("Activating Schedule!");
        return setInterval(() => {
            this.getLatestItems();
        }, 10000);
        // }, 300000);
    }


    getLatestItems() {
        // Request html from url
        axios
            .get(this.url)
            // On data
            .then(res => {

                // Parse to HTML
                let html = HTMLParser.parse(res.data);
                // Get individual ads
                let listingItems = html.querySelectorAll('.regular-ad');

                // Items to item objects
                let myItems = []
                for (let item of listingItems) {
                    myItems.push(this.getItem(item));
                }

                // if no pre-loaded items
                if (this.latest == null || this.latest.length === 0) {
                    // load all items found
                    console.log("No pre-loads on this seeker. Loading now...")
                    this.latest = myItems;

                    // send to observable
                    this.data$.next((myItems.length > 5) ? myItems.slice(0, 5) : myItems);
                    return;
                }

                // if pre-loaded items
                //      find new ones and load items
                // Check for new items
                console.log("Getting latest items...")
                let latest_item_index = myItems.findIndex(item => item.id === this.latest[0].id);

                let newItems = myItems.slice(0, latest_item_index);
                // If there are no new items
                if (newItems.length === 0) {
                    // console.log("Seeker found no new items for " + )
                    return;
                }

                // call next and re assign to latest property
                this.data$.next(newItems);
                this.latest = newItems;
            })
            .catch(error => {
                console.error("=======================[ERROR]=======================")
                console.error(error)
                return [];
            })
    }



    getItem(item) {
        // itemData['location'] = dateLocationItem.childNodes[1];
        // #mainPageContent > div.layout-3 > div.col-2 > main > div:nth-child(2) > div:nth-child(38) > div > div.info > div > div.location > span.date-posted

        let itemData = {}
        let dateLocationItem = item.querySelector('.location');

        let titleElement = item.querySelector('.title');

        itemData['url'] = "https://www.kijiji.ca" + titleElement.querySelector('a').getAttribute('href');
        itemData['title'] = titleElement.rawText.trim();
        itemData['price'] = item.querySelector('.price').rawText.trim();
        itemData['desc'] = item.querySelector('.description').rawText.trim();

        itemData['location'] = dateLocationItem.querySelector('span').rawText.trim();
        itemData['date'] = (dateLocationItem.querySelector('.date-posted') == null) ? 'NULL' : dateLocationItem.querySelector('.date-posted').rawText.trim();

        itemData['id'] = item.getAttribute('data-listing-id');

        return new Item(itemData);
    }

}

module.exports = Seeker;
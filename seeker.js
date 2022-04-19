// var http = require('http');
const axios = require('axios');
const HTMLParser = require('node-html-parser');
const rxjs = require('rxjs');
const Item = require('./models/item');


class Seeker {
    constructor(url) {
        this.url = url;
        this.latest = [];


        this.initial = true;

        this.data$ = new rxjs.BehaviorSubject([]);

        this.getLatestItems();

        this.scheduleRef = this.activateSchedule();

        console.log("Now seeking on " + this.url);
    }


    activateSchedule() {
        console.log("Activating Schedule!");
        return setInterval(() => {
            this.getLatestItems();
            // }, 600000);
        }, 300000);
    }

    // getNewItems() {

    //     // Get all items available in page
    //     let pageItems = this.getPageItems();

    //     // If no pre-loaded, add all as latest
    //     if (!this.latest || this.latest.length === 0) {
    //         this.data$.next(pageItems);

    //         return pageItems;
    //     }

    //     // If there are pre-loaded items
    //     // Check for new items
    //     let first_old_index = pageItems.findIndex(item => item.id === this.latest[0].id);

    //     let newItems = pageItems.subarray(0, first_old_index);
    //     // If there are new items
    //     if (newItems.length === 0)
    //         return [];

    //     // call next and re assign to latest property
    //     this.data$.next(newItems);

    //     return newItems;
    // }

    getLatestItems() {
        // Request items


        axios
            .get(this.url)
            .then(res => {

                // Organize into item objects
                let html = HTMLParser.parse(res.data);
                let listingItems = html.querySelectorAll('.regular-ad');

                let myItems = []
                for (let item of listingItems) {
                    myItems.push(this.getItem(item));
                }

                // if no pre-loaded items
                if (!this.latest || this.latest.length === 0) {
                    // load all items found
                    console.log("No pre-loads. Adding now.")
                    this.latest = myItems;

                    // If initial value
                    // if (this.initial) {
                    //     // myItems['initial'] = true;
                    //     this.initial = false;
                    // }

                    this.data$.next(myItems);
                    return;
                }

                // if pre-loaded items
                //      find new ones and load items
                // Check for new items
                console.log("Getting latest...")
                let first_old_index = myItems.findIndex(item => item.id === this.latest[0].id);

                let newItems = myItems.slice(0, first_old_index);
                // If there are no new items
                if (newItems.length === 0)
                    return;

                // call next and re assign to latest property
                this.data$.next(newItems);
                this.latest = newItems;
            })
            .catch(error => {
                console.error("ERROR=======================")
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
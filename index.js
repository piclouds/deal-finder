const { Telegraf } = require('telegraf')
const Seeker = require('./seeker');
const User = require('./models/user');
const getUserServices = require('./user-services');


const users = [];

const util = {
    // getUserId: (id) => {
    //     return users.findIndex(user => user.id === id);
    // },
    // newUser: (user, id, name) => {
    //     if(getUserId(id) === -1) {
    //         users
    //     }
    // }
}

process.env['BOT_TOKEN'] = "5353208283:AAEN9STFsUq5FgQ8dmHGGIbrfNGuFIyTTCc";

const bot = new Telegraf(process.env.BOT_TOKEN)

// let a = new Seeker("https://www.kijiji.ca/b-cell-phone/ontario/iphone/k0c760l9004?price=20__350");
// a.data$.subscribe((data) => {
//     console.log("Data from subject");
//     console.log(data);
// });



// doesUserExist(id) {

// }
bot
bot.start((ctx) => {
    let user = getUserServices().newUser(ctx.update.message.from.username, ctx.update.message.from.id, ctx.update.message.from.first_name);

    ctx.reply(`Hello ${user.first_name},\nWelcome to Deal Finder. You can subscribe to a search 
    results page on Kijiji, (and soon facebook market) by making a search on these websites, configuring
     search terms and filters, and then using the search URL to subscribe and get notified of any new item(s)
      for that search result.`)
})



bot.command('subscribe', ctx => {
    // Get user id
    let userId = ctx.update.message.from.id;
    // Create/get user
    let user = getUserServices().newUser(ctx.update.message.from.username, userId, ctx.update.message.from.first_name);

    // Extract subscribing URL
    let url = ctx.update.message.text.substring(10).trim();
    // New seeker
    const seeker = user.newSeeker(url);

    // If seeker exists
    if (seeker === null) {
        ctx.reply("A seeker with the provided url is already active.")
        return;
    }

    // Subscribe to seeker's updates
    seeker.data$.subscribe((latest) => {
        let i = 0;
        for (let item of latest) {
            ctx.reply(`
            **${item.title}** \n \`${item.desc}\` \n\n ${item.price} \n\n Visit: ${item.url}
            `);
        }
    })
})

bot.help((ctx) => ctx.reply('Use /subscribe <url> to subscribe to a search result.'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))

// Start the bot
bot.launch()
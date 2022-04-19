const { Telegraf } = require('telegraf')
const Seeker = require('./seeker');
const User = require('./models/user');

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
bot.start((ctx) => ctx.reply('Welcome'))
bot.command('subscribe', ctx => {
    let userId = ctx.update.message.from.id;
    let userIndex = users.findIndex(user => { user.id === userId });
    if(userIndex === -1) {
        userIndex = users.length;
        users.push(new User(ctx.update.message.from.username, userId, ctx.update.message.from.first_name))
    }

    let url = ctx.update.message.text.substring(10).trim();

    const seeker = users[userIndex].newSeeker(url);

    seeker.data$.subscribe((latest) => {
        let i = 0;
        for(let item of latest) {
            ctx.reply(`
            ${item.title} \n ${item.desc} \n ${item.price} \n\n ${item.url}
            `);
            if(seeker.initial && i++ > 5) {
                seeker.initial = false;
                break;
            }
        }
    })
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
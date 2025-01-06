const { Bot } = require('grammy');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Ganti dengan token bot Anda
const bot = new Bot('7956762549:AAFLGuXP8lJT1vkuEiNuTXmQ43OSdp2lS3s');

// Fungsi untuk mendapatkan daftar video hentai
async function getHentaiList() {
    const page = Math.floor(Math.random() * 1153);
    const response = await fetch(`https://sfmcompile.club/page/${page}`);
    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);

    const list = [];
    $("#primary > div > div > ul > li > article").each(function (a, b) {
        list.push({
            title: $(b).find("header > h2").text(),
            link: $(b).find("header > h2 > a").attr("href"),
            category: $(b).find("header > div.entry-before-title > span > span").text().replace("in ", ""),
            share_count: $(b).find("header > div.entry-after-title > p > span.entry-shares").text(),
            views_count: $(b).find("header > div.entry-after-title > p > span.entry-views").text(),
            type: $(b).find("source").attr("type") || "image/jpeg",
            video_1: $(b).find("source").attr("src") || $(b).find("img").attr("data-src"),
            video_2: $(b).find("video > a").attr("href") || "",
        });
    });

    return list;
}

// Fungsi untuk mendapatkan caption video
function getCaption(obj) {
    return `*Title:* ${obj.title}\n*Link:* ${obj.link}\n*Category:* ${obj.category}\n*Share Count:* ${obj.share_count}\n*Views Count:* ${obj.views_count}\n*Type:* ${obj.type}`;
}

// Handler untuk perintah /hentai
bot.command('hentai', async (ctx) => {
    const inputText = ctx.message.text.split(' ')[1];
    if (inputText) {
        await ctx.reply('Tunggu sebentar...');
        try {
            const list = await getHentaiList();
            const selectedIndex = parseInt(inputText) - 1;
            if (selectedIndex < 0 || selectedIndex >= list.length) {
                await ctx.reply('Invalid video number!');
                return;
            }
            const selectedVideo = list[selectedIndex];
            const caption = getCaption(selectedVideo);
            const replyMarkup = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'More Hentai', url: 'https://example.com' }], // Ganti dengan URL yang sesuai
                    ],
                },
            };

            await ctx.replyWithVideo(selectedVideo.video_1 || selectedVideo.video_2, {
                caption: caption,
                reply_markup: replyMarkup,
            });
        } catch (error) {
            console.error('Error:', error);
            await ctx.reply('An error occurred while processing your request.');
        }
    } else {
        // Jika tidak ada input, tampilkan daftar video
        const list = await getHentaiList();
        const teks = list
            .slice(0, 9)
            .map((obj, index) => `*${index + 1}.* ${obj.title}`)
            .join("\n");
        await ctx.reply(`*[ HENTAI LIST ]*\n${teks}\n\n*Input Number from 1 to 9 to get video*`, { parse_mode: 'Markdown' });
    }
});

// Mulai bot
bot.start();

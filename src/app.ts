process.env.APIFY_HEADLESS = '1';

import cheerio from 'cheerio';
import Apify from 'apify';

Apify.main(async () => {
    const requestList = await Apify.openRequestList(null, [
        { url: 'https://www.mlb.com/scores' }
    ]);

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        handlePageFunction: async ({ response }): Promise<void> => {
            const text = await response.text();
            const $ = cheerio.load(text);
            $('div[data-test-mlb="singleGameContainer"]').each(function (
                this: CheerioElement
            ) {
                const gameDiv = $(this);

                const teams: string[] = [];
                gameDiv
                    .find('div[data-mlb-test="teamNameLabel"]')
                    .each(function (this: CheerioElement) {
                        teams.push($(this).text());
                    });

                const gameStart: string[] = [];
                gameDiv
                    .find('div [class="sc-fzoOEf eXkYNB"]')
                    .each(function (this: CheerioElement) {
                        gameStart.push($(this).text());
                    });

                const score1: string[] = [];
                gameDiv
                    .find('div [class="sc-fzqLLg gOxPot"]')
                    .each(function (this: CheerioElement) {
                        score1.push($(this).text());
                    });

                const score2: string[] = [];
                gameDiv
                    .find('div [class="sc-fzqLLg hPWsUK"]')
                    .each(function (this: CheerioElement) {
                        score2.push($(this).text());
                    });

                const stats: string[] = [];
                gameDiv
                    .find('div [class="sc-qapaw sc-oTmZL fdsmny"]')
                    .each(function (this: CheerioElement) {
                        stats.push($(this).text());
                    });

                console.log(gameStart);
                console.log(teams);
                console.log(score1);
                console.log(score2);
                console.log(stats);
            });
        },
        maxRequestsPerCrawl: 10,
        maxConcurrency: 1
    });

    await crawler.run();
});

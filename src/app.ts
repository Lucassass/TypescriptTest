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
                    .find('div[data-mlb-test="gameStartTimesStateContainer"]')
                    .each(function (this: CheerioElement) {
                        gameStart.push(
                            $(this).parent().children().first().text()
                        );
                    });

                //needs to add correct way to get results and then find a way to check if its a live game or finished game while still getting scores
                const scores: string[] = [];
                gameDiv
                    .find('td[data-col="0"]')
                    .each(function (this: CheerioElement) {
                        scores.push($(this).text());
                    });

                const stats: string[] = [];
                gameDiv
                    .find('div[data-mlb-test="teamNameLabel"]')
                    .each(function (this: CheerioElement) {
                        stats.push($(this).parent().children().last().text());
                    });
                console.log(gameStart);
                console.log(teams);
                console.log(stats);
                console.log(scores);
                console.log('');
            });
        },
        //amount of request to webpage
        maxRequestsPerCrawl: 10,
        //amount of puppeters running
        maxConcurrency: 1
    });

    await crawler.run();
});

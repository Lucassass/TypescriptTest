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
                console.log(teams);
            });
        },
        maxRequestsPerCrawl: 100,
        maxConcurrency: 1
    });

    await crawler.run();
});

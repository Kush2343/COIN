const axios = require('axios');
const News = require('../models/news');
const fetchAndSaveNews = async () => {
    try {
        const response = await axios.get(
            "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk",
            {
                headers: {
                    "X-RapidAPI-Key":
                        "a0b97c1a43msh0603ff17936859bp17968cjsnd3b5d174235d",
                    "X-RapidAPI-Host": "cryptocurrency-news2.p.rapidapi.com",
                },
            }
        );

        const newsData = response?.data?.data;
        // console.log("newsData", newsData);
        for (const newsItem of newsData) {
            // Check if a news article with the same title already exists
            const existingNews = await News.findOne({ title: newsItem?.title });
            if (!existingNews) {
                const news = new News({
                    url: newsItem?.url,
                    title: newsItem?.title,
                    description: newsItem?.description,
                    thumbnail: newsItem?.thumbnail,
                    createdAt: new Date(newsItem?.createdAt),
                });
                await news.save();
            }
        }

        console.log("Data saved to database");
    } catch (error) {
        console.error(error);
    }
};

module.exports = { fetchAndSaveNews };

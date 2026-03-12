const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const ESAPI = require("node-esapi");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            // Validate and sanitize the symbol parameter to prevent SSRF
            const symbol = req.query.symbol;
            if (!/^[A-Za-z0-9]{1,5}$/.test(symbol)) {
                return res.status(400).render("research", {
                    error: "Invalid stock symbol. Only alphanumeric characters allowed (max 5 chars).",
                    environmentalScripts
                });
            }
            // Use a fixed base URL to prevent SSRF attacks
            const baseUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
            const url = baseUrl + encodeURIComponent(symbol);
            return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    // Escape HTML/JSON content to prevent XSS from external API responses
                    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
                    const escapedBody = ESAPI.encoder().encodeForHTML(bodyStr);
                    res.write("<pre>" + escapedBody + "</pre>");
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;

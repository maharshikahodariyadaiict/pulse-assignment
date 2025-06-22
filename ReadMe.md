# Web Scraper
Developed a script to scrape product reviews from Capterra for a specific company. (

Exposed REST apis using express server. More details in [Usage](#Usage) section.

## Installation
Use node >=v.20 (LTS recommended) & npm >=v10 to install node_modules dependency.

Open terminal and go to app folder
```bash
cd <path>/web-scraper

npm install
```

Meanwhile, update proxy-server variable **SECRET_CREDENTIAL** constant in `web-scraper/src/constants/index.js` file. Value shared via email.

After hitting below command, express server will start on PORT 3000.
```bash
npm run start

# Terminal will show below message once server is ready
Web Scraper app listening on port 3000
```

## Usage
To scrape data 2 REST api endpoints are provided.
### 1 - /v1/reviews
Get endpoint expecting below query params. All of them are must otherwise it will return 400 Bad request with error.
- name - Company name as per website 
    - Assumption: Use product from popular categories only. There are 999 software categories, I have only scraped product links from 12 popular categories covering most of 5279 products. 
- source - Capterra
- startDate - MM/DD/YYYY format only
- endDate - MM/DD/YYYY format only

#### CURL
```
curl --location 'http://localhost:3000/v1/reviews?name=Keka&source=Capterra&startDate=1/1/2025&endDate=2/1/2025'
```
#### Sample Response
Response contains 
- time: Script execution time
- data: Array of reviews
- error: Error string if any

```json
{
    "time": "0 minutes, 12 seconds",
    "data": [
        {
            "name": "Pankaj",
            "date": "2025-01-29T11:02:49Z",
            "reviewRating": 5,
            "title": "Best Payroll software",
            "description": [
                "Comments: I have been using this from last 1 year. Its Very good software. Timely updation of attendance. Easy to export reports. Easily track expenses. Good in expense management.",
                "Pros:",
                "Easy to use, Simple Dashboard, easily you can pull employee reports. This is good application for employees payroll record, tax calculation, benefits details, payslip etc. Along with this, it is used for employees reimbursement expenses details. This is useful for employees as well as employer.",
                "Cons:",
                "1. Easy to Use, Useful for employees and employer 2. Best in Tax calculation, easy and timely updates. 3. Easily export reports"
            ]
        },
        {
            "name": "Anonymous Reviewer",
            "date": "2025-01-08T12:46:57Z",
            "reviewRating": 4,
            "title": "User-friendly and customizable",
            "description": [
                "Pros:",
                "Keka is easy to understand and use. It provides various features and customizations to manage my company's entire HR operations.",
                "Cons:",
                "Besides being easy to use, Keka is a little expensive."
            ]
        }
    ]
}
```

### 2 - /v1/listing
Get list of products under given category. Using local script to add this mappings to `src/context/data-source/capterra.js`

- Query params.
- category - Software category name as listed on [capterra](https://www.capterra.in/directory)

#### CURL
```
curl --location 'http://localhost:3000/v1/listing?category=Accounting%20Software'
```
#### Sample Response
```json
{
    "time": "0 minutes, 12 seconds",
    "data": {
        "multiledger": "https://www.capterra.in/reviews/1119/checkmark-multiledger?sort=most_recent",
        "slingshot-enterprise-business-suite": "https://www.capterra.in/reviews/99433/slingshot-enterprise?sort=most_recent",
        "phc-go": "https://www.capterra.in/reviews/141137/phc-fx?sort=most_recent",
        "move2clouds": "https://www.capterra.in/reviews/140821/move2clouds?sort=most_recent",
        "managemart": "https://www.capterra.in/reviews/148574/managemart?sort=most_recent",
        ...
        "flowie": "https://www.capterra.in/reviews/1051263/flowie?sort=most_recent",
        "clientix-financials": "https://www.capterra.in/reviews/1051571/clientix-financials?sort=most_recent",
        "cash--credit": "https://www.capterra.in/reviews/1051719/cash-credit?sort=most_recent"
    }
}
```

## Implementation
#### For Capterra,
I used proxy to fetch html source from capterra server. They have rateLimit implemented & cloudfare antibot system implemented. Using proxy server helped me avoid that.

#### To optimise time, I have used binary search approach whenever there are more than 80 pages to find page span of queried reviews. 

#### For G2,
I was not able to figure out complete solution in given time. I completed partial solution but I'm still working on it.

#
#### Thank you so much for assignment. 
#### It was challenging. Had a great time solving it.

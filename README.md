# JobSkills-Scraper
Express Node script for scraping data from client specific job advert urls and returning most desired job skills


CURRENT STATE:

forEach through jobObj, requests url, tries to load html using cheerio and then scrapes jobName and JobDesc and makes these properties
of an object in the jobs array.

OUTPUT:
currently very sporadic, usually only 1/5 jobs object complete.

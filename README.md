Using jQuery Tweetie from https://github.com/PlethoraThemes/Tweetie

#Usage
New Twitter API requires oAuth Token Key, so it's three step process.

## Step 1

First, you need a consumer key and secret keys. Get one from [dev.twitter.com/apps](https://dev.twitter.com/apps).

## Step 2

Edit `api/config.php` file and replace variables with your Consumer and oAuth Keys.

```PHP
    // Consumer Key
    define('CONSUMER_KEY', 'CONSUMER_KEY_HERE');
    define('CONSUMER_SECRET', 'CONSUMER_SECRET_HERE');

    // User Access Token
    define('ACCESS_TOKEN', 'ACCESS_TOKEN_HERE');
    define('ACCESS_SECRET', 'ACCESS_SECRET_HERE');
```

## Step 3

Run on Apache and go to localhost/Twittie

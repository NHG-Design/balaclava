# Welcome to the Torn API

[Documentation](https://www.torn.com/api.html#) \| [Try It!](https://www.torn.com/api.html#) \| [Custom Key Builder](https://www.torn.com/api.html#) \| [API v2 (Swagger)](https://www.torn.com/swagger/openapi.json)
\| [Patch Notes](https://www.torn.com/api.html#)

Introduction

The goal of the Torn API is to provide a fully supported and read-only method for players to pull useful
information from Torn about their player, faction, or company. This can be used individually to retrieve
information about your account, or you can build a website that the entire community can use to do
interesting things with the data exposed via the API.

Potential

Whether you're making a browser extension to aid factions during wartime, a mobile application to offer
instant notifications, or a website to track data for graphing - the possibilities are endless - simply
using the 16 character API keys. We encourage you to be creative, building features and tools that expand
Torn's gameplay and enjoyment.

Acceptable usage

This system has been developed so that you should only ever need to request an API key from the user. All of
the user's information can be obtained with just their key, there shouldn't be any requirement to ask for a
name or user ID. Torn passwords should **never** be requested from any users, ever.

You must keep keys, and the data obtained from them, securely protected and confidential unless permitted by
the key owner. By accepting other user's keys, they are placing their trust in you - do not exploit this. We
will permanently ban offending applications from accessing the API at a moment's notice.

We respectfully request that you follow Torn's no-advertising policy when building websites or applications
that use our API system to ensure optimal user experience, however, exceptions can be made. Please [contact us](mailto:webmaster@torn.com) if you would like to advertise, accept voluntary
real-money donations or charge users for usage.

Please make sure your scripts are optimised to retrieve only the information required for the specific
request they're making. They should be retrieving as little information as possible; this will improve
loading time and reduce stress on Torn's servers.

All scripts or tools must be compliant with the API Terms of Service Guidelines defined below.

API Terms of Service (ToS) Guidelines

When creating a script, userscript, sheet, extension, API service, bot, 3rd party website or any other API tool (collectively "service"), the end user must be aware of how
will their API key be used.

Here's a table with the information that is important to the end user - giving them a good idea of what to
expect from the API service they're using:

|                                                                                                                                                             |                                                                                                                            |                                                                                                                                                                                                |                                                                                                                                                 |                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Data Storage**                                                                                                                                            | **Data Sharing**                                                                                                           | **Purpose of Use**                                                                                                                                                                             | **Key Storage & Sharing**                                                                                                                       | **Key Access Level**                                                          |
| Will the data be stored for any purpose?                                                                                                                    | Who can access the data besides the end user?                                                                              | What is the stored data being used for?                                                                                                                                                        | Will the API key be stored securely and who can access it?                                                                                      | What key access level or specific selections are required?                    |
| `No / Only locally`<br>`Temporary - less than a minute`<br>`Temporary - less than a day`<br>`Persistent - until account deletion`<br>`Persistent - forever` | `Nobody`<br>`Faction`<br>`Friends & faction`<br>`General public`<br>`Service owners`<br>`Service owners & their customers` | `Non malicious statistical analysis`<br>`Public amusement`<br>`Public community tools`<br>`Competitive advantage [Please specify]`<br>`Personal gain [Please specify]``Other [Please specify]` | `Not stored / Not shared`<br>`Stored / Used only for automation`<br>`Stored / Shared with the faction`<br>`Stored / Shared with other services` | `Public`<br>`Minimal`<br>`Limited`<br>`Full`<br>`Custom - specify selections` |

If the service is not storing or sharing the data or the key anywhere, it's enough to state so, otherwise ToS with the information above needs to be clearly and visibly stated in any place where user is providing their API key in the table format highlighted above.

When integrating your service with another service (opt-in), make sure there's at least a link to ToS of the service you're allowing the user to integrate with.

When integrating your service with another service (automatically), your ToS need to cover the usage of the service you're integrating with.

Using keys for purposes other than the ones described in the ToS or deceiving the end user
into believing that the key is being used for a purpose other than described is prohibited and is a
punishable offense.

These rules also apply to those who purchase API keys from other players.

If you're unsure how to describe your service, feel free to contact [Torn staff.](https://www.torn.com/staff.php)

If you suspect your key was misused, you can use ['key'\\
-\> 'log'](https://www.torn.com/swagger.php#/Key/get_key_log) selection to view & monitor API key usage history.

All services must be compliant with [Torn's scripting rules](https://www.torn.com/rules.php).

ToS examples can be found at the bottom of this page.

Unfair advantage

We understand that crafting an API system for Torn could give some users an unfair advantage. We want the
system to expand & enhance gameplay rather than giving users an advantage which makes it easier to compete
against others. We have taken this into account during development, but we will be listening to feedback and
making any appropriate changes that are required.

Logging

Please be aware, we log all details and inputs of requests and make routine checks. If misuse occurs, we will
permanently ban IP addresses, keys, and users from accessing the system without notice.

Automatic limits & blocks

Each user can make up to 100 individual requests per minute across all of their keys, this should be more
than enough for almost anything to be achievable. Multiple requests using invalid keys may result in a
temporary IP ban - you must account for this by removing disabled or invalid keys upon error.

These limits may change without notice to ensure the Torn servers remain stable.

Cache

There are two different types of cache in the works.

## Service Cache

All API requests are cached by the service, and this cache can last up to 30 seconds. With this type of cache,
two subsequent, identical requests, will return the same data.

The purpose of this cache is to simply to reduce the server load because multiple tools/websites/scripts/etc. might request
the same data nearly at the same time, and there's usually no need to process these requests individually.

However, this can sometimes become a nuisance, because in some cases you might need fresh information. Because of this,
everyone is free to bypass this cache by using e.g. \`timestamp\` query parameter to make their request unique (\`comment\`
query parameter is ignored for this) whenever they need to.

Requests which hit the service cache are not consuming the API key quota.

## Global Cache

Several selections are cached globally. This means, all users who request these selections will get the same data,
regardless of the API key used or if their request is unique.

This type of cache is set on the server-side, and simply cannot be bypassed.

The main purpose of this cache is to prevent the potential unfair advantage certain selections could introduce.

There is only a handful of selections which are utilizing this type of cache.

Current globally cached selections are:

- 'market' -> 'itemmarket'
- 'market' -> 'properties'
- 'market' -> 'rentals'
- 'company' -> 'companies'
- 'user' -> 'bazaar'
- 'torn' -> 'bounties'
- 'user' -> 'bounties'

Selection access levels

API keys have can have one of four different access levels, this will limit which selections they're able to
access. We've assigned access level requirements to every selection, these are visible in the table
below.

|               |
| ------------- |
| Access Levels |

| Public |

| Minimal Access |

| Limited Access |

| Full Access |

\*This selection is only available in API v1.

\*\*This selection is only available in API v2.

\*\*\*This selection has different access in API v1 and v2.

Error codes
0 => Unknown error : Unhandled error, should not occur.

1 => Key is empty : Private key is empty in current request.

2 => Incorrect Key : Private key is wrong/incorrect format.

3 => Wrong type : Requesting an incorrect basic type.

4 => Wrong fields : Requesting incorrect selection fields.

5 => Too many requests : Requests are blocked for a small period of time because of too many requests per user
(max 100 per minute).

6 => Incorrect ID : Wrong ID value.

7 => Incorrect ID-entity relation : A requested selection is private (For example, personal data of another user
/ faction).

8 => IP block : Current IP is banned for a small period of time because of abuse.

9 => API disabled : Api system is currently disabled.

10 => Key owner is in federal jail : Current key can't be used because owner is in federal jail.

11 => Key change error : You can only change your API key once every 60 seconds.

12 => Key read error : Error reading key from Database.

13 => The key is temporarily disabled due to owner inactivity : The key owner hasn't been online for more than 7
days.

14 => Daily read limit reached : Too many records have been pulled today by this user from our cloud
services.

15 => Temporary error : An error code specifically for testing purposes that has no dedicated meaning.

16 => Access level of this key is not high enough : A selection is being called of which this key does not have
permission to access.

17 => Backend error occurred, please try again.

18 => API key has been paused by the owner.

19 => Must be migrated to crimes 2.0.

20 => Race not yet finished.

21 => Incorrect category : Wrong cat value.

22 => This selection is only available in API v1.

23 => This selection is only available in API v2.

24 => Closed temporarily.

25 => Invalid stat requested.

26 => Only category or stats can be requested.

27 => Must be migrated to organized crimes 2.0.

28 => Incorrect log ID.

29 => Category selection is not available for interaction logs.

API Terms of Service Examples

### Example No. 1

Description: a 3rd party website utilizing 'user' -> 'log' selection to show detailed statistics for certain gameplay areas which stores key or data only in the user's browser.

ToS: You maintain full control of your data; everything is stored in your browser. No data is sent anywhere.

For such websites, ToS in the table format is not necessary, but might be useful to end users and could look something like this:

|                                          |                                               |                                           |                                                            |                                                            |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Storage**                         | **Data Sharing**                              | **Purpose of Use**                        | **Key Storage & Sharing**                                  | **Key Access Level**                                       |
| Will the data be stored for any purpose? | Who can access the data besides the end user? | What is the stored data being used for?   | Will the API key be stored securely and who can access it? | What key access level or specific selections are required? |
| `Only locally`                           | `Nobody`                                      | `Not eligible - only end user has access` | `Stored locally / Not shared`                              | `Full Access`                                              |

### Example No. 2

Description: a 3rd party website sharing personal data between faction members. The website stores API key and private user information in its own database.

ToS:

|                                                         |                                               |                                             |                                                            |                                                            |
| ------------------------------------------------------- | --------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Storage**                                        | **Data Sharing**                              | **Purpose of Use**                          | **Key Storage & Sharing**                                  | **Key Access Level**                                       |
| Will the data be stored for any purpose?                | Who can access the data besides the end user? | What is the stored data being used for?     | Will the API key be stored securely and who can access it? | What key access level or specific selections are required? |
| `Persistent - until account deletion or faction change` | `Faction`                                     | `Show information to other faction members` | `Stored remotely securely / Used only for automation`      | `Limited Access`                                           |

### Example No. 3

Description: a browser extension providing notifications based on cooldowns and other user's activity which allows fully opt-in integration with other services.

ToS: You maintain full control of your data; everything is stored in your browser. No data is sent anywhere. You can view our detailed API usage here : link_to_api_usage_page

\[\] Service XYZ: Check the checkbox to integrate Service XYZ. Terms of Service for XYZ can be found here: link_to_XYZ_tos

\[\] Service ZZZ: Check the checkbox to integrate Service ZZZ. Terms of Service for ZZZ can be found here: link_to_ZZZ_tos

For such extension, ToS in the table format is not necessary, but might be useful to end users and could look something like this:

|                                          |                                               |                                           |                                                            |                                                            |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Storage**                         | **Data Sharing**                              | **Purpose of Use**                        | **Key Storage & Sharing**                                  | **Key Access Level**                                       |
| Will the data be stored for any purpose? | Who can access the data besides the end user? | What is the stored data being used for?   | Will the API key be stored securely and who can access it? | What key access level or specific selections are required? |
| `Only locally`                           | `Nobody`                                      | `Not eligible - only end user has access` | `Stored locally / Not shared`                              | `Limited Access`                                           |

### Example No. 4

Description: a google sheet pulling current plushie/flower prices.

ToS:

|                                          |                                               |                                                                      |                                                            |                                                            |
| ---------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Storage**                         | **Data Sharing**                              | **Purpose of Use**                                                   | **Key Storage & Sharing**                                  | **Key Access Level**                                       |
| Will the data be stored for any purpose? | Who can access the data besides the end user? | What is the stored data being used for?                              | Will the API key be stored securely and who can access it? | What key access level or specific selections are required? |
| `Persistent - Until sheet deletion`      | `Everyone with a sheet access`                | `Competitive Advantage [Monitoring of underpriced Plushies/Flowers]` | `Stored in code details / Everyone with sheet access`      | `Custom : 'market' -> 'itemmarket'`                        |

### Example No. 5

Description: a discord faction bot where submitted API key is used to fetch data for other services.

ToS:

|                                                                                                                                                                           |                                                           |                                                                                                                                                                                                                                  |                                                                             |                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Data Storage**                                                                                                                                                          | **Data Sharing**                                          | **Purpose of Use**                                                                                                                                                                                                               | **Key Storage & Sharing**                                                   | **Key Access Level**                                       |
| Will the data be stored for any purpose?                                                                                                                                  | Who can access the data besides the end user?             | What is the stored data being used for?                                                                                                                                                                                          | Will the API key be stored securely and who can access it?                  | What key access level or specific selections are required? |
| `Persistent - data is forever visible on faction discord`<br>`Persistent - data is forever visible on other discord servers`<br>`Persistent - data is saved to server DB` | `Friends & faction`<br>`Service owners & their customers` | `Competitive advantage [Discord notifications about players holding large amounts of cash after selling items through Item Market / Bazaar]`<br>`Personal gain [Selling data gathered with the key to other players / factions]` | `Stored securely / Shared with other services : XYZ Mug Bot, XYZ Cache Bot` | `Limited Access`                                           |

API Key:

### User

#### [https://api.torn.com/user/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#iuDemo)

User ID:

Selections:

**Notes:**\[1\] User ID not required
when requesting the key's owner data. \[2\] Accepts comma separated selections.
\[3\] 'from' and 'to' UNIX timestamps can be passed to filter some
selections

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/user/
```

Raw

Pretty

Try it!

### Property

#### [https://api.torn.com/property/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#ipDemo)

Property ID:

Selections:

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/property/
```

Raw

Pretty

Try it!

### Faction

#### [https://api.torn.com/faction/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#ifDemo)

Faction ID:

Selections:

**Notes:**\[1\] Faction ID not
required when requesting the key's owner data. \[2\] Accepts comma separated
selections. \[3\] 'from' and 'to' UNIX timestamps can be passed to filter some
selections. \[4\] The 'contributors' selection requires the inclusion of the stat
name (I.e. &stat=busts)

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/faction/
```

Raw

Pretty

Try it!

### Company

#### [https://api.torn.com/company/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#icDemo)

Company ID:

Selections:

**Notes:**\[1\] Company ID not
required when requesting the key's owner data. \[2\] Accepts comma separated
selections.

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/company/
```

Raw

Pretty

Try it!

### Market

#### [https://api.torn.com/market/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#iiDemo)

Item ID:

Selections:

**Notes:**\[1\] Accepts comma
separated selections.

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/market/
```

Raw

Pretty

Try it!

### Torn

#### [https://api.torn.com/torn/:ID?selections=:SELECTIONS&key=:KEY](https://www.torn.com/api.html#itDemo)

ID:

Selections:

**Notes:**\[1\] Accepts comma
separated selections.

**Available fields:** Enter your API Key in order to see the available
fields.

```
https://api.torn.com/torn/
```

Raw

Pretty

Try it!

Custom keys

It is possible to generate an API key which has permissions to the exact selections required for your
tool.

**Custom keys should be treated as if they are full-access keys.** This means - be careful with
selections you choose and how/if you decide to share such keys.

By default, custom keys can access only the default selection, timestamp and lookup selection.

You can always check the permissions of a key on this endpoint: [https://api.torn.com/key/?selections=info&key=YOUR_KEY_HERE](https://api.torn.com/key/?selections=info&key=)

Once you've chosen all the selections you wish for your new API key to have, simply click the link to
generate your new key. This will open your settings page in a new tab.

Key name:

|               |
| ------------- |
| Access Levels |

| Public |

| Minimal Access |

| Limited Access |

| Full Access |

---

When creating custom keys which include the 'user' -> 'log' selection, you can specify log categories or log types this key should have access to.

If no log categories or types are specified, the key will have access to all log categories and types.

You can only select **up to 10 categories**.

Selected log categories:

Search for:

---

\*This selection is only available in API v1.

\*\*This selection is only available in API v2.

\*\*\*This selection has different access in API v1 and v2.
